import {
	createBuildingSchema,
	createFinishSchema,
	FinishType,
	type CreateBuildingDto,
	type CreateFinishDto,
	type CreateImageDto
} from '$lib/types';
import { createBuilding } from '../db/queries/building';

import path from 'path';
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';

type ServiceError = {
	code: number;
	message: string;
};

const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

function parseBuilding(formData: FormData): {
	building: CreateBuildingDto | null;
	error: ServiceError | null;
} {
	const type = formData.get('type');
	const name = formData.get('name');
	const width = formData.get('width');
	const length = formData.get('length');
	const bedrooms = formData.get('bedrooms');
	const bathrooms = formData.get('bathrooms');
	const floors = formData.get('floors');
	const roof = formData.get('roof');
	const veranda = formData.has('veranda');

	const result = createBuildingSchema.safeParse({
		type,
		name,
		width,
		length,
		bedrooms,
		bathrooms,
		floors,
		roof,
		veranda
	});

	if (result.error)
		return {
			building: null,
			error: {
				code: 404,
				message: result.error.message
			}
		};

	return { building: result.data, error: null };
}

function parseImages(formData: FormData): {
	images: File[] | null;
	error: ServiceError | null;
} {
	const files = (formData.getAll('images') as File[]).filter((f) => f.size > 0);

	console.log(files);

	if (!files || files.length === 0)
		return {
			images: null,
			error: { code: 400, message: 'В записи здания должно быть минимум одно изображение!' }
		};

	return { images: files, error: null };
}

function parseFinish(
	formData: FormData,
	type: FinishType
): {
	finish: CreateFinishDto | null;
	error: ServiceError | null;
} {
	const data = formData.get(type) as string;

	if (!data) return { finish: null, error: null };

	let finish: unknown;

	try {
		finish = JSON.parse(data);

		const result = createFinishSchema.safeParse(finish);

		if (!result.success)
			return { finish: null, error: { code: 400, message: result.error.message } };

		return { finish: result.data, error: null };
	} catch {
		return {
			finish: null,
			error: { code: 400, message: 'Некорректный JSON в поле комплектации' }
		};
	}
}

export async function addBuilding(formData: FormData): Promise<{ error: ServiceError | null }> {
	const { building, error: parseBuildingError } = parseBuilding(formData);

	if (!building || parseBuildingError) return { error: parseBuildingError };

	const { images: imageFiles, error: parseImagesError } = parseImages(formData);

	if (!imageFiles || parseImagesError) return { error: parseImagesError };

	const savedImages = await saveImagesToDisk(imageFiles);

	const { finish: coldFinish, error: parseColdFinishError } = parseFinish(
		formData,
		FinishType.COLD
	);

	if (!coldFinish || parseColdFinishError) return { error: parseColdFinishError };

	const { finish: warmFinish, error: parseWarmFinishError } = parseFinish(
		formData,
		FinishType.WARM
	);

	if (!warmFinish || parseWarmFinishError) return { error: parseWarmFinishError };

	const { finish: allYearFinish, error: parseAllYearFinishError } = parseFinish(
		formData,
		FinishType.ALL_YEAR
	);

	if (!allYearFinish || parseAllYearFinishError) return { error: parseAllYearFinishError };

	if (!coldFinish && !warmFinish && !allYearFinish)
		return { error: { code: 400, message: 'Должна присутствовать хотябы одна комплектация!' } };

	const { building: newBuilding, error: createBuildingError } = await createBuilding(
		building,
		savedImages,
		[coldFinish, warmFinish, allYearFinish]
	);

	if (!newBuilding || createBuildingError)
		return { error: { code: 400, message: 'Не удалось домавить новое здание!' } };

	return { error: null };
}

async function saveImagesToDisk(imageFiles: File[]): Promise<CreateImageDto[]> {
	if (!fs.existsSync(IMAGES_DIR)) {
		fs.mkdirSync(IMAGES_DIR, { recursive: true });
	}

	const images: CreateImageDto[] = [];

	for (const image of imageFiles) {
		if (!(image instanceof File) || image.name === '' || image.size <= 0) continue;

		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const ext = path.extname(image.name);
		const uuid = uuidv4();

		const newName = `${uuid}${ext}`;

		const filePath = path.join(IMAGES_DIR, newName);
		fs.writeFileSync(filePath, buffer);

		images.push({ isMain: false, filename: newName });
	}

	return images;
}
