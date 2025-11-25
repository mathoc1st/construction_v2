import { getBuildingById } from '$lib/server/db/queries/building';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number.parseInt(params.id);

	if (Number.isNaN(id)) return error(404);

	const building = await getBuildingById(id);

	if (building) {
		return building;
	}

	error(404, 'Not found');
};
