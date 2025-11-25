import { SortBy, type ParsedBuilding, type ParsedFinish } from '$lib/types/';
import type { BuildingType, FinishType } from '../../../../../prisma/src/generated/prisma/enums';
import type {
	BuildingOrderByWithRelationInput,
	BuildingWhereInput
} from '../../../../../prisma/src/generated/prisma/models';
import prisma from '../prisma';

type filterOptions = {
	floors?: Array<number>;
	finishes?: Array<FinishType>;
	sizes?: Array<string>;
	sortBy?: SortBy;
	limit?: number;
	page?: number;
	veranda?: string | null;
};

export async function getBuildingsByType(buildingType: BuildingType, options: filterOptions = {}) {
	const where: BuildingWhereInput = { type: buildingType };

	if (options.floors && options.floors.length > 0) {
		where.floors = { in: options.floors };
	}

	if (options.finishes && options.finishes.length > 0) {
		where.finishes = {
			some: {
				type: { in: options.finishes }
			}
		};
	}

	if (options.sizes && options.sizes.length > 0) {
		where.size = { in: options.sizes };
	}

	if (options.veranda) {
		where.veranda = options.veranda === 'true';
	}

	const orderBy: BuildingOrderByWithRelationInput = {};

	if (options.sortBy) {
		if (options.sortBy === SortBy.POPULARITY_DESC) orderBy.views = 'desc';
		if (options.sortBy === SortBy.POPULARITY_ASC) orderBy.views = 'asc';
		if (options.sortBy === SortBy.PRICE_DESC) orderBy.startingPrice = 'desc';
		if (options.sortBy === SortBy.PRICE_ASC) orderBy.startingPrice = 'asc';
	}

	orderBy.views = 'desc';
	const [buildings, totalCount] = await Promise.all([
		prisma.building.findMany({
			where,
			include: {
				finishes: { include: { options: true } },
				images: true
			},
			orderBy,
			take: options.limit || 12,
			skip: options.page ? (options.page - 1) * (options.limit || 12) : 0
		}),
		prisma.building.count({
			where
		})
	]);
	return { buildings, totalCount };
}

export async function getBuildingsCountByType(type: BuildingType) {
	return prisma.building.count({ where: { type } });
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

export async function getBuildingDetailsByType(type: BuildingType) {
	return prisma.building.findMany({
		where: { type },
		select: {
			floors: true,
			size: true,
			finishes: true
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
