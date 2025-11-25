import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBuildingDetailsByType, getBuildingsByType } from '$lib/server/db/queries/building';
import z from 'zod';
import { BuildingType } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const type = params.type;

	const result = z.enum(BuildingType).safeParse(type.toUpperCase());

	if (!result.success) return error(404);

	const { buildings, totalCount } = await getBuildingsByType(result.data);
	const details = await getBuildingDetailsByType(result.data);

	if (!buildings || !details) return error(404);

	return { buildings, details, totalCount };
};
