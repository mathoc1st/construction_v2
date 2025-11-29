import {
	buildingSchema,
	finishSchema,
	type ParsedFinish,
	buildingOptionsSchema,
	type GetBuildingsByTypeResult,
	type HandlerResult,
	type AddBuildingResult,
	type UpdateBuildingResult
} from '$lib/types';
import {
	createBuilding,
	updateBuilding,
	getBuildingsByType,
	deleteBuilding
} from '../db/queries/building';

import path from 'path';
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';
import { getImagesByBuildingId } from '../db/queries/images';
import { logger } from '../logger';
import { ServiceException, toServiceError, zodErrorMessage } from '$lib/utils';

const log = logger.child({ module: 'BuildingService' });
const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

export async function handleGetBuildingsByType(
	url: URL
): Promise<HandlerResult<GetBuildingsByTypeResult>> {
	const type = url.searchParams.get('type');
	const page = url.searchParams.get('page');
	const limit = url.searchParams.get('limit');
	const sortBy = url.searchParams.get('sortBy');
	const floors = url.searchParams.getAll('floor');
	const finishes = url.searchParams.getAll('finish');
	const sizes = url.searchParams.getAll('size');
	const veranda = url.searchParams.get('veranda');

	const parsedOptionsResult = buildingOptionsSchema.safeParse({
		type,
		page,
		limit,
		sortBy,
		floors,
		finishes,
		sizes,
		veranda
	});

	if (!parsedOptionsResult.success) {
		log.error('Failed to parse building options: %s', zodErrorMessage(parsedOptionsResult.error));
		return {
			error: { status: 400, message: zodErrorMessage(parsedOptionsResult.error) }
		};
	}

	try {
		const result = await getBuildingsByType(parsedOptionsResult.data);
		return { result };
	} catch (err) {
		log.error('Failed to get buildings: %s', { error: err });

		const message = err instanceof Error ? err.message : String(err);

		return { error: { status: 500, message } };
	}
}

export async function handleAddBuilding(
	request: Request
): Promise<HandlerResult<AddBuildingResult>> {
	try {
		const formData = await request.formData();

		const { parsedBuilding, parsedFinishesRaw, imageFiles } = await parseBuildingFormData(formData);

		const {
			building,
			finishes,
			images: imageFilesParsed
		} = validateParsedBuilding(parsedBuilding, parsedFinishesRaw, imageFiles);

		const imageNames = await saveImagesOrFail(imageFilesParsed);

		const result = await createBuilding(building, imageNames, finishes);
		return { result };
	} catch (err) {
		log.error('Add building failed: %o', err);
		return { error: toServiceError(err) };
	}
}

export async function handleUpdateBuilding(
	request: Request
): Promise<HandlerResult<UpdateBuildingResult>> {
	try {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		if (isNaN(id)) throw new ServiceException(400, 'Invalid building id');

		const { parsedBuilding, parsedFinishesRaw, imageFiles } = await parseBuildingFormData(formData);

		const {
			building,
			finishes,
			images: newFiles
		} = validateParsedBuilding(parsedBuilding, parsedFinishesRaw, imageFiles);

		// --- Move old images to trash ---
		const oldImages = await getImagesByBuildingId(id);
		const recoveryId = crypto.randomUUID();
		const recoveryPath = `_trash/recovery-${recoveryId}`;

		moveImagesOrFail(oldImages, recoveryPath);

		let newImages: string[] = [];
		try {
			// --- 2) Save new images ---
			newImages = await saveImagesOrFail(newFiles);

			// --- 3) Update DB ---
			const result = await updateBuilding(id, building, newImages, finishes);

			// --- 4) If everything succeeded, destroy the stash ---
			deleteFolder(recoveryPath);

			return { result };
		} catch (innerErr) {
			log.error('Update failed, restoring old images...', innerErr);

			// --- Restore ---
			restoreImagesFromRecovery(recoveryPath);
			deleteImagesOrFail(newImages);

			throw innerErr; // will be handled by outer catch
		}
	} catch (err) {
		log.error('Update building failed: %o', err);
		return { error: toServiceError(err) };
	}
}

export async function handleDeleteBuilding(url: URL) {
	try {
		const idString = url.searchParams.get('id');

		const id = Number(idString);
		if (isNaN(id)) throw new ServiceException(400, 'Invalid building id');

		const oldImages = await getImagesByBuildingId(id);
		const recoveryId = crypto.randomUUID();
		const recoveryPath = `_trash/recovery-${recoveryId}`;

		moveImagesOrFail(oldImages, recoveryPath);

		try {
			await deleteBuilding(id);
			deleteFolder(recoveryPath);

			return { error: null };
		} catch (innerErr) {
			log.error('Delete failed, restoring images...', innerErr);

			// --- Restore ---
			restoreImagesFromRecovery(recoveryPath);

			throw innerErr; // will be handled by outer catch
		}
	} catch (err) {
		log.error('Delete building failed: %o', err);
		return { error: toServiceError(err) };
	}
}

async function parseBuildingFormData(formData: FormData) {
	const buildingData = formData.get('building');
	const finishesData = formData.get('finishes');
	const imageFiles = formData.getAll('image');

	// --- Validate presence ---
	if (!buildingData || buildingData instanceof File)
		throw new ServiceException(400, 'Invalid building data');

	if (!finishesData || finishesData instanceof File)
		throw new ServiceException(400, 'Invalid finishes data');

	let parsedBuilding: unknown;
	let parsedFinishesRaw: unknown;

	try {
		parsedBuilding = JSON.parse(buildingData as string);
		parsedFinishesRaw = JSON.parse(finishesData as string);
	} catch {
		throw new ServiceException(400, 'Invalid JSON in form data');
	}

	return { parsedBuilding, parsedFinishesRaw, imageFiles };
}

function validateParsedBuilding(
	parsedBuilding: unknown,
	parsedFinishesRaw: unknown,
	imageFilesRaw: FormDataEntryValue[]
) {
	// --- Building ---
	const b = buildingSchema.safeParse(parsedBuilding);
	if (!b.success) throw new ServiceException(400, zodErrorMessage(b.error));

	// --- Finishes ---
	if (!Array.isArray(parsedFinishesRaw))
		throw new ServiceException(400, 'Finishes must be an array');

	const finishes: ParsedFinish[] = [];
	for (const f of parsedFinishesRaw) {
		const parsed = finishSchema.safeParse(f);
		if (parsed.success) finishes.push(parsed.data);
	}

	if (finishes.length === 0) throw new ServiceException(400, 'No valid finishes provided');

	// --- Images ---
	const images: File[] = [];
	for (const file of imageFilesRaw) {
		if (file instanceof File && file.name && file.size > 0) images.push(file);
	}

	if (images.length === 0) throw new ServiceException(400, 'No valid images provided');

	return { building: b.data, finishes, images };
}

type ImageLike = File | { filename: string } | string;

async function saveImagesOrFail(files: File[]) {
	try {
		return await saveImagesToDisk(files);
	} catch (err) {
		throw new ServiceException(500, (err as Error).message);
	}
}

async function saveImagesToDisk(imageFiles: File[]): Promise<string[]> {
	if (!fs.existsSync(IMAGES_DIR)) {
		fs.mkdirSync(IMAGES_DIR, { recursive: true });
	}

	const images: string[] = [];

	for (const imageFile of imageFiles) {
		const arrayBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const ext = path.extname(imageFile.name);
		const uuid = uuidv4();

		const image = `${uuid}${ext}`;

		const filePath = path.join(IMAGES_DIR, image);
		fs.writeFileSync(filePath, buffer);

		images.push(image);
	}

	return images;
}

function deleteImages(images: ImageLike[]) {
	if (!fs.existsSync(IMAGES_DIR)) {
		log.warn(`Tried to delete images from a non-existent folder ${IMAGES_DIR}`);
		return;
	}

	for (const img of images) {
		const filename = extractFilename(img);
		if (!filename) {
			log.warn(`Skipping invalid image reference: ${img}`);
			continue;
		}

		// Prevent path traversal (e.g. "../../etc/passwd")
		if (filename.includes('/') || filename.includes('\\')) {
			log.error(`Unsafe filename detected, skipping: ${filename}`);
			continue;
		}

		const filePath = path.join(IMAGES_DIR, filename);

		if (!fs.existsSync(filePath)) {
			log.info(`Skipping deletion of missing file: ${filePath}`);
			continue;
		}

		try {
			fs.unlinkSync(filePath); // Use unlink for files
		} catch (err) {
			log.error(`Failed to delete image ${filePath}: %o`, err);
		}
	}
}

function deleteImagesOrFail(images: ImageLike[]) {
	try {
		return deleteImages(images);
	} catch (err) {
		throw new ServiceException(500, (err as Error).message);
	}
}

export function moveImages(images: ImageLike[], dstDir: string) {
	const recoveryDir = path.join(IMAGES_DIR, dstDir);

	if (!fs.existsSync(recoveryDir)) {
		fs.mkdirSync(recoveryDir, { recursive: true });
	}

	for (const img of images) {
		const filename = extractFilename(img);
		if (!filename) continue;

		const src = path.join(IMAGES_DIR, filename);
		const dest = path.join(recoveryDir, filename);

		if (fs.existsSync(src)) {
			fs.renameSync(src, dest);
		}
	}
}

export function moveImagesOrFail(images: ImageLike[], dstDir: string) {
	try {
		return moveImages(images, dstDir);
	} catch (err) {
		throw new ServiceException(500, (err as Error).message);
	}
}

export function restoreImagesFromRecovery(folder: string) {
	const recoveryDir = path.join(IMAGES_DIR, folder);

	if (!fs.existsSync(recoveryDir)) {
		throw new ServiceException(500, `Recovery folder does not exist: ${recoveryDir}`);
	}

	const images = fs.readdirSync(recoveryDir);

	for (const filename of images) {
		const src = path.join(recoveryDir, filename);
		const dest = path.join(IMAGES_DIR, filename);

		fs.renameSync(src, dest);
	}

	// delete the recovery folder itself
	fs.rmSync(recoveryDir, { recursive: true, force: true });
}

export function deleteFolder(folder: string) {
	const full = path.join(IMAGES_DIR, folder);

	if (!fs.existsSync(full)) return;

	fs.rmSync(full, { recursive: true, force: true });
}

function extractFilename(img: ImageLike): string | null {
	// <File>
	if (img instanceof File) {
		if (img.name && img.size > 0) return img.name;
		return null;
	}

	// { filename: string }
	if (typeof img === 'object' && 'filename' in img) {
		return img.filename;
	}

	// string (the filename itself)
	if (typeof img === 'string') {
		return img;
	}

	return null;
}

// export function recoverImages(images: ImageLike[]) {
// 	if (!fs.existsSync(IMAGES_DIR)) return;

// 	const trashDir = path.join(IMAGES_DIR, '_trash');
// 	if (!fs.existsSync(trashDir)) return;

// 	for (const img of images) {
// 		const filename = extractFilename(img);
// 		if (!filename) continue;

// 		const src = path.join(trashDir, filename);
// 		const dest = path.join(IMAGES_DIR, filename);

// 		if (fs.existsSync(src)) {
// 			fs.renameSync(src, dest);
// 		}
// 	}
// }
