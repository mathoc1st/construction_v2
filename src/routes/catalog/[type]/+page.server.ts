import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBuildingDetailsByType, getBuildingsByType } from '$lib/server/db/queries/building';
import { buildingOptionsSchema } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const parsedOptions = buildingOptionsSchema.safeParse({ type: params.type });

	if (!parsedOptions.success) return error(404);

	const { buildings, totalCount } = await getBuildingsByType(parsedOptions.data);
	const details = await getBuildingDetailsByType(parsedOptions.data.type);

	if (!buildings || !details) return error(404);

	return { buildings, details, totalCount };
};
