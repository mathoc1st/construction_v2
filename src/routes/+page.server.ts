import { getBuildingsByType } from '$lib/server/db/queries/building';
import { BuildingType, SortBy } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const popularFrames = await getBuildingsByType({
		type: BuildingType.FRAME,
		sortBy: SortBy.POPULARITY_DESC
	});
	const popularBarns = await getBuildingsByType({
		type: BuildingType.BARN,
		sortBy: SortBy.POPULARITY_DESC
	});
	const popularContainers = await getBuildingsByType({
		type: BuildingType.CONTAINER,
		sortBy: SortBy.POPULARITY_DESC
	});

	return { popularFrames, popularBarns, popularContainers };
};
