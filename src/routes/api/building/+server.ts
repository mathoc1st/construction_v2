import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Building, BuildingDto, Finish, FinishDto } from '$lib/types';
import { addBuilding, updateBuilding } from '$lib/server/services/building';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const images = formData.getAll('image') as File[];
	// Get building DTO
	const buildingJson = formData.get('building') as string;
	const building: BuildingDto = JSON.parse(buildingJson);

	// Get finishes
	const finishesJson = formData.get('finishes') as string;
	const finishes: FinishDto[] = JSON.parse(finishesJson);

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
