import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBuildingById } from '$lib/server/db/queries/building';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;

	if (slug === 'new') {
		return {};
	}

	const id = Number.parseInt(slug);

	console.log(slug);

	if (Number.isNaN(slug)) return error(404);

	const building = await getBuildingById(id);

	if (!building) return error(404);
	return { building };
};
