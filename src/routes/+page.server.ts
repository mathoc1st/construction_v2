import { getBuildingsByType } from '$lib/server/db/queries/building';
import { BuildingType, SortBy } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [popularFrames, popularBarns, popularContainers] = await Promise.all([
		getBuildingsByType({ type: BuildingType.FRAME, sortBy: SortBy.POPULARITY_DESC }),
		getBuildingsByType({ type: BuildingType.BARN, sortBy: SortBy.POPULARITY_DESC }),
		getBuildingsByType({ type: BuildingType.CONTAINER, sortBy: SortBy.POPULARITY_DESC })
	]);

	return { popularFrames, popularBarns, popularContainers };
};
