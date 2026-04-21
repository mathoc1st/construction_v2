import {
	SortBy,
	type ParsedBuilding,
	type ParsedBuildingOptions,
	type ParsedFinish
} from '$lib/types/';
import type { BuildingType } from '../../../../../prisma/src/generated/prisma/enums';
import type {
	BuildingOrderByWithRelationInput,
	BuildingWhereInput
} from '../../../../../prisma/src/generated/prisma/models';
import prisma from '../prisma';

// type filterOptions = {
// 	floors?: Array<number>;
// 	finishes?: Array<FinishType>;
// 	sizes?: Array<string>;
// 	sortBy?: SortBy;
// 	limit?: number;
// 	page?: number;
// 	veranda?: string | null;
// };

export async function getBuildingsByType(options: ParsedBuildingOptions) {
	const where: BuildingWhereInput = { type: options.type };

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
		where.size = {
			in: options.sizes.map((s) => {
				return `${s.length}x${s.width}`;
			})
		};
	}

	where.veranda = options.veranda !== null ? options.veranda : undefined;

	const orderBy: BuildingOrderByWithRelationInput = {};

	if (options.sortBy) {
		if (options.sortBy === SortBy.POPULARITY_DESC) orderBy.views = 'desc';
		if (options.sortBy === SortBy.POPULARITY_ASC) orderBy.views = 'asc';
		if (options.sortBy === SortBy.PRICE_DESC) orderBy.startingPrice = 'desc';
		if (options.sortBy === SortBy.PRICE_ASC) orderBy.startingPrice = 'asc';
	}

	const [buildings, totalCount] = await Promise.all([
		prisma.building.findMany({
			where,
			include: {
				finishes: true,
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

export async function deleteBuilding(id: number) {
	return prisma.building.delete({ where: { id } });
}

export async function getBuildingById(id: number) {
	const building = await prisma.building.findUnique({
		where: { id },
		include: {
			finishes: true,
			images: true
		}
	});

	if (building) {
		await prisma.building.update({
			where: { id: building.id },
			data: { views: { increment: 1 } }
		});
	}
	return building;
}

export async function getBuildingDetailsByType(type: BuildingType) {
	const buildings = await prisma.building.findMany({
		where: { type },
		select: {
			floors: true,
			size: true,
			finishes: {
				select: {
					type: true
				}
			}
		}
	});

	const sizes = [...new Set(buildings.map((b) => b.size))];

	const floors = [...new Set(buildings.flatMap((b) => b.floors))];

	const finishes = [...new Set(buildings.flatMap((b) => b.finishes.map((f) => f.type)))];

	return { sizes, floors, finishes };
}

export async function createBuilding(
	building: ParsedBuilding,
	images: string[],
	finishes: ParsedFinish[]
) {
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
						description: finish.description
					};
				})
			}
		},
		include: {
			images: true,
			finishes: true
		}
	});

	return { building: createdBuilding };
}

export async function updateBuilding(
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
								description: finish.description
							};
						})
					}
				},
				include: {
					images: true,
					finishes: true
				}
			})
		]);
		return { error: null };
	} catch (error) {
		return { error: (error as Error).message };
	}
}
