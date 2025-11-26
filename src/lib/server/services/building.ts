import {
	buildingSchema,
	finishSchema,
	type BuildingDto,
	type FinishDto,
	type ParsedBuilding,
	type ParsedFinish,
	type Image
} from '$lib/types';
import { createBuilding, updateBuildingById } from '../db/queries/building';

import path from 'path';
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';

type ServiceError = {
	code: number;
	message: string;
};

const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

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

	const savedImages = await saveImagesToDisk(images);

	delteImagesFromDisk(images);

	const parsedFinishesResult = parseFinishes(finishes);

	if (!parsedFinishesResult.ok) return { error: parsedFinishesResult.error };

	const { error: updateBuildingError } = await updateBuildingById(
		id,
		parseBuildingResult.building,
		savedImages,
		parsedFinishesResult.finishes
	);

	if (updateBuildingError) return { error: { code: 400, message: 'Не удалось обновить!' } };

	return { error: null };
}

export function delteImagesFromDisk(imageFiles: File[] | Image[]) {
	if (!fs.existsSync(IMAGES_DIR)) {
		return;
	}

	for (const image of imageFiles) {
		if (image instanceof File) {
			if (!(image instanceof File) || image.name === '' || image.size <= 0) continue;

			const filePath = path.join(IMAGES_DIR, image.name);
			fs.rmSync(filePath, { force: true });
		} else {
			const filePath = path.join(IMAGES_DIR, image.filename);
			fs.rmSync(filePath, { force: true });
		}
	}
}
