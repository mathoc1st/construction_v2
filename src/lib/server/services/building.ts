import {
	buildingSchema,
	finishSchema,
	type BuildingDto,
	type FinishDto,
	type ParsedBuilding,
	type ParsedFinish,
	buildingOptionsSchema
} from '$lib/types';
import { createBuilding, updateBuildingById, getBuildingsByType } from '../db/queries/building';

import path from 'path';
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';
import { getImagesByBuildingId } from '../db/queries/images';

type ServiceError = {
	code: number;
	message: string;
};

const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

export async function handleGetBuildingsByType(url: URL) {
	const type = url.searchParams.get('type');
	const page = url.searchParams.get('page');
	const limit = url.searchParams.get('limit');
	const sortBy = url.searchParams.get('sortBy');
	const floors = url.searchParams.getAll('floor');
	const finishes = url.searchParams.getAll('finish');
	const sizes = url.searchParams.getAll('size');
	const veranda = url.searchParams.get('veranda');

	const parsedOptions = buildingOptionsSchema.safeParse({
		type,
		page,
		limit,
		sortBy,
		floors,
		finishes,
		sizes,
		veranda
	});

	if (!parsedOptions.success)
		return {
			buildings: null,
			totalCount: null,
			error: { status: 400, message: parsedOptions.error.message }
		};
	const { buildings, totalCount } = await getBuildingsByType(parsedOptions.data);

	return { buildings, totalCount, error: null };
}

export async function addBuilding(
	building: BuildingDto,
	images: File[],
	finishes: FinishDto[]
): Promise<{ error: ServiceError | null }> {
	const parseBuildingResult = parseBuilding(building);

	if (!parseBuildingResult.ok) return { error: parseBuildingResult.error };

	const parseImagesError = parseImages(images);

	if (parseImagesError) return { error: parseImagesError };

	const savedImages = await saveImagesToDisk(images);

	const parsedFinishesResult = parseFinishes(finishes);

	if (!parsedFinishesResult.ok) return { error: parsedFinishesResult.error };

	const { building: newBuilding, error: createBuildingError } = await createBuilding(
		parseBuildingResult.building,
		savedImages,
		parsedFinishesResult.finishes
	);

	if (!newBuilding || createBuildingError)
		return { error: { code: 400, message: 'Не удалось добавить новое здание!' } };

	return { error: null };
}

function parseBuilding(building: BuildingDto) {
	const result = buildingSchema.safeParse(building);

	if (!result.success) {
		return {
			ok: false as const,
			error: { code: 400, message: result.error.message } as ServiceError
		};
	}

	return {
		ok: true as const,
		building: result.data as ParsedBuilding
	};
}

function parseImages(images: File[]): ServiceError | null {
	if (!images || images.length === 0)
		return { code: 400, message: 'В записи должно быть минимум одно изображение!' };

	return null;
}

function parseFinishes(finishes: FinishDto[]) {
	const parsedFinishes: ParsedFinish[] = [];

	for (const finish of finishes) {
		if (!finish.price || !finish.options) continue;

		const result = finishSchema.safeParse(finish);
		if (!result.success) {
			return {
				ok: false as const,
				error: { code: 404, message: result.error.message } as ServiceError
			};
		}

		parsedFinishes.push(result.data);
	}

	if (parsedFinishes.length === 0)
		return {
			ok: false as const,
			error: {
				code: 400,
				message: 'Должна присутствовать хотя бы одна комплектация!'
			} as ServiceError
		};

	return {
		ok: true as const,
		finishes: parsedFinishes as ParsedFinish[]
	};
}

async function saveImagesToDisk(imageFiles: File[]): Promise<string[]> {
	if (!fs.existsSync(IMAGES_DIR)) {
		fs.mkdirSync(IMAGES_DIR, { recursive: true });
	}

	const images: string[] = [];

	for (const image of imageFiles) {
		if (!(image instanceof File) || image.name === '' || image.size <= 0) continue;

		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const ext = path.extname(image.name);
		const uuid = uuidv4();

		const newName = `${uuid}${ext}`;

		const filePath = path.join(IMAGES_DIR, newName);
		fs.writeFileSync(filePath, buffer);

		images.push(newName);
	}

	return images;
}

export async function updateBuilding(
	id: number,
	building: BuildingDto,
	images: File[],
	finishes: FinishDto[]
): Promise<{ error: ServiceError | null }> {
	const parseBuildingResult = parseBuilding(building);

	if (!parseBuildingResult.ok) return { error: parseBuildingResult.error };

	const parseImagesError = parseImages(images);

	if (parseImagesError) return { error: parseImagesError };

	const oldImages = await getImagesByBuildingId(id);

	trashImages(oldImages);

	const savedImages = await saveImagesToDisk(images);

	const parsedFinishesResult = parseFinishes(finishes);

	if (!parsedFinishesResult.ok) return { error: parsedFinishesResult.error };

	const { error: updateBuildingError } = await updateBuildingById(
		id,
		parseBuildingResult.building,
		savedImages,
		parsedFinishesResult.finishes
	);

	if (updateBuildingError) {
		trashImages(savedImages);
		recoverImages(oldImages);
		return { error: { code: 400, message: 'Не удалось обновить!' } };
	}

	emptyTrash();
	return { error: null };
}

type ImageLike = File | { filename: string } | string;

export function trashImages(images: ImageLike[]) {
	if (!fs.existsSync(IMAGES_DIR)) return;

	const trashDir = path.join(IMAGES_DIR, '_trash');
	if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true });

	for (const img of images) {
		const filename = extractFilename(img);
		if (!filename) continue;

		const src = path.join(IMAGES_DIR, filename);
		const dest = path.join(trashDir, filename);

		if (fs.existsSync(src)) {
			fs.renameSync(src, dest);
		}
	}
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

export function recoverImages(images: ImageLike[]) {
	if (!fs.existsSync(IMAGES_DIR)) return;

	const trashDir = path.join(IMAGES_DIR, '_trash');
	if (!fs.existsSync(trashDir)) return;

	for (const img of images) {
		const filename = extractFilename(img);
		if (!filename) continue;

		const src = path.join(trashDir, filename);
		const dest = path.join(IMAGES_DIR, filename);

		if (fs.existsSync(src)) {
			fs.renameSync(src, dest);
		}
	}
}

export function emptyTrash() {
	const trashDir = path.join(IMAGES_DIR, '_trash');

	// Trash folder doesn't exist → nothing to do
	try {
		fs.accessSync(trashDir);
	} catch {
		return;
	}

	const files = fs.readdirSync(trashDir);

	for (const file of files) {
		const filePath = path.join(trashDir, file);
		const stat = fs.lstatSync(filePath);

		if (stat.isDirectory()) {
			fs.rmSync(filePath, { recursive: true, force: true });
		} else {
			fs.unlinkSync(filePath);
		}
	}
}
