import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	BuildingType,
	FinishType,
	SortBy,
	type Building,
	type BuildingDto,
	type Finish,
	type FinishDto
} from '$lib/types';
import { addBuilding, delteImagesFromDisk, updateBuilding } from '$lib/server/services/building';
import z from 'zod';
import { getBuildingsByType, removeBuilding } from '$lib/server/db/queries/building';
import { getImagesByBuildingId } from '$lib/server/db/queries/images';

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	const page = url.searchParams.get('page');
	const sortBy = url.searchParams.get('sortBy') as SortBy;
	const floors = url.searchParams.getAll('floor');
	const finishes = url.searchParams.getAll('finish');
	const sizes = url.searchParams.getAll('size');
	const veranda = url.searchParams.get('veranda');

	const typeResult = z.enum(BuildingType).safeParse(type?.toUpperCase());
	if (!typeResult.success) return error(404);

	const pageResult = z.coerce.number().safeParse(page);

	const parsedFloors = floors.map((f) => Number(f)).filter((f) => !isNaN(f));
	const parsedFinishes = finishes.filter(
		(f) => f == FinishType.WARM || f == FinishType.COLD || f == FinishType.ALL_YEAR
	);

	const { buildings, totalCount } = await getBuildingsByType(typeResult.data, {
		floors: parsedFloors,
		finishes: parsedFinishes,
		sizes,
		page: pageResult.data,
		veranda,
		sortBy
	});

	return json({ buildings, totalCount });
};

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const images = formData.getAll('image') as File[];
	// Get building DTO
	const buildingJson = formData.get('building') as string;
	const building: BuildingDto = JSON.parse(buildingJson);

	// Get finishes
	const finishesJson = formData.get('finishes') as string;
	const finishes: FinishDto[] = JSON.parse(finishesJson);

	console.log(finishes);

	const { error: addBuildingError } = await addBuilding(building, images, finishes);

	if (addBuildingError) {
		throw error(addBuildingError.code, addBuildingError.message);
	}

	return json({ status: 200 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const idStr = formData.get('id') as string;
	const id = Number.parseInt(idStr);
	if (Number.isNaN(id)) throw error(400, 'Id is not a number');

	const images = formData.getAll('image') as File[];
	// Get building DTO
	const buildingJson = formData.get('building') as string;
	const building: Building = JSON.parse(buildingJson);

	// Get finishes
	const finishesJson = formData.get('finishes') as string;
	const finishes: Finish[] = JSON.parse(finishesJson);

	const { error: addBuildingError } = await updateBuilding(id, building, images, finishes);

	if (addBuildingError) {
		throw error(addBuildingError.code, addBuildingError.message);
	}

	return json({ status: 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
	const idStr = url.searchParams.get('id');

	if (!idStr) throw error(400, 'id is not present');

	const id = Number.parseInt(idStr);

	if (Number.isNaN(id)) throw error(400, 'id is NaN');

	const images = await getImagesByBuildingId(id);

	delteImagesFromDisk(images);
	await removeBuilding(id);

	return json({ status: 200 });
};
