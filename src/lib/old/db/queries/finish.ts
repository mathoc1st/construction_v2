import type { BuildingType } from '$lib/types';
import prisma from '../prisma';

export async function getFinishTypesByBuildingType(buildingType: BuildingType) {
	return await prisma.finish.findMany({
		where: {
			building: {
				type: buildingType
			}
		},
		select: {
			type: true
		}
	});
}
