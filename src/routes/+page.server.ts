import { getBuildingsByType } from '$lib/server/db/queries/building';
import { BuildingType, SortBy } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const popularFrames = await getBuildingsByType(BuildingType.FRAME, {
		limit: 3,
		sortBy: SortBy.POPULARITY_DESC
	});
	const popularBarns = await getBuildingsByType(BuildingType.BARN, {
		limit: 3,
		sortBy: SortBy.POPULARITY_DESC
	});
	const popularContainers = await getBuildingsByType(BuildingType.CONTAINER, {
		limit: 3,
		sortBy: SortBy.POPULARITY_DESC
	});

	return { popularFrames, popularBarns, popularContainers };
};
