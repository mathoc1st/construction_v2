import { SortBy, type ParsedBuilding, type ParsedFinish } from '$lib/types/';
import type { BuildingType, FinishType } from '../../../../../prisma/src/generated/prisma/enums';
import type {
	BuildingOrderByWithRelationInput,
	BuildingWhereInput
} from '../../../../../prisma/src/generated/prisma/models';
import prisma from '../prisma';

export async function getBuildingsByType(
	buildingType: BuildingType,
	floors: Array<number> = [],
	finishes: Array<FinishType> = [],
	dimensions: Array<string> = [],
	sortBy: SortBy = SortBy.POPULARITY_DESC,
	limit = 10,
	page = 0
) {
	const where: BuildingWhereInput = { type: buildingType };

	if (floors.length > 0) {
		where.floors = { in: floors };
	}

	if (finishes.length > 0) {
		where.finishes = {
			some: {
				type: { in: finishes }
			}
		};
	}

	if (dimensions.length > 0) {
		where.size = { in: dimensions };
	}

	const orderBy: BuildingOrderByWithRelationInput = {};

	if (sortBy === SortBy.POPULARITY_DESC) orderBy.views = 'desc';
	if (sortBy === SortBy.POPULARITY_ASC) orderBy.views = 'asc';
	if (sortBy === SortBy.PRICE_DESC) orderBy.startingPrice = 'desc';
	if (sortBy === SortBy.PRICE_ASC) orderBy.startingPrice = 'asc';

	return prisma.building.findMany({
		where,
		include: {
			finishes: { include: { options: true } },
			images: true
		},
		orderBy,
		take: limit,
		skip: page * limit
	});
}

export async function getBuildingById(id: number) {
	return prisma.building.findUnique({
		where: { id },
		include: {
			finishes: { include: { options: true } },
			images: true
		}
	});
}

export async function getBuildingDetails() {
	return prisma.building.findMany({
		select: {
			floors: true,
			length: true,
			width: true
		}
	});
}
export async function createBuilding(
	building: ParsedBuilding,
	images: string[],
	finishes: ParsedFinish[]
) {
	try {
		const createdBuilding = await prisma.building.create({
			data: {
				...building,
				size: `${building.length}x${building.width}`,
				startingPrice: Math.min(...finishes.map((f) => f.price)),
				images: {
					create: images.map((i) => {
						return { filename: i };
					})
				},
				finishes: {
					create: finishes.map((finish) => {
						return {
							type: finish.type,
							price: finish.price,
							oldPrice: finish.oldPrice,
							options: {
								create: finish.options
							}
						};
					})
				}
			},
			include: {
				images: true,
				finishes: {
					include: {
						options: true
					}
				}
			}
		});

		return { building: createdBuilding, error: null };
	} catch (error) {
		return { building: null, error: (error as Error).message };
	}
}

// export async function getPopularBuildingsByType(buildingType: BuildingType) {
// 	return prisma.building.findMany({
// 		where: {
// 			type: buildingType
// 		},
// 		orderBy: {
// 			views: 'desc'
// 		},
// 		take: 3,
// 		include: {
// 			finishes: { include: { options: true } },
// 			images: true
// 		}
// 	});
// }

export async function updateBuildingById(
	id: number,
	building: ParsedBuilding,
	images: string[],
	finishes: ParsedFinish[]
) {
	try {
		await prisma.$transaction([
			prisma.image.deleteMany({ where: { buildingId: id } }),
			prisma.finish.deleteMany({ where: { buildingId: id } }),
			prisma.building.update({
				where: { id },
				data: {
					...building,
					size: `${building.length}x${building.width}`,
					startingPrice: Math.min(...finishes.map((f) => f.price)),
					images: {
						create: images.map((i) => {
							return { filename: i };
						})
					},
					finishes: {
						create: finishes.map((finish) => {
							return {
								type: finish.type,
								price: finish.price,
								oldPrice: finish.oldPrice,
								options: {
									create: finish.options
								}
							};
						})
					}
				},
				include: {
					images: true,
					finishes: {
						include: {
							options: true
						}
					}
				}
			})
		]);
		return { error: null };
	} catch (error) {
		return { error: (error as Error).message };
	}
}
