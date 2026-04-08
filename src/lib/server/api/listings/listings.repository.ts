import type {
	BuildingFilterOptions,
	BuildingSortableFields,
	FinishFilterOptions,
	FinishSortableFields,
	IListingsRepository,
	ListingFilterOptions,
	ListingQueryOptions,
	ListingSortableFields
} from '$lib/types/listings/listings.repository.types';
import {
	SortDirection,
	type DbClient,
	type SortOptions
} from '$lib/types/prisma/prisma.service.types';
import { ListingId, type Listing as DomainListing } from './listing.domain';
import { Prisma, ImageStatus as PrismaImageStatus } from '../prisma/generated/client';
import type {
	FinishType as PrismaFinishType,
	ConstructionType as PrismaConstructionType
} from '../prisma/generated/enums';
import { FinishType as DomainFinishType } from '$lib/types/finishes/finish.domain.types';
import { ConstructionType as DomainConstructionType } from '$lib/types/buildings/building.domain.types';
import { ListingMapper } from './listing.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { ImageStatus as DomainImageStatus } from '$lib/types/images/image.domain.types';
import type { Image } from '../images/image.domain';

function omitId<T extends { id?: unknown }>(obj: T): Omit<T, 'id'> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id, ...rest } = obj;
	return rest;
}

export const finishTypePrismaMap: Record<PrismaFinishType, DomainFinishType> = {
	COLD: DomainFinishType.COLD,
	WARM_100: DomainFinishType.WARM_100,
	WARM_150: DomainFinishType.WARM_150,
	WARM_200: DomainFinishType.WARM_200
};

const constructionTypePrismaMap: Record<PrismaConstructionType, DomainConstructionType> = {
	FRAME: DomainConstructionType.FRAME,
	BARN: DomainConstructionType.BARN,
	CONTAINER: DomainConstructionType.CONTAINER
};

const imageStatusPrismaMap: Record<PrismaImageStatus, DomainImageStatus> = {
	TEMP: DomainImageStatus.TEMP,
	ACTIVE: DomainImageStatus.ACTIVE,
	DELETED: DomainImageStatus.DELETED
};

type ListingWithRelations = Prisma.ListingGetPayload<{
	include: {
		building: {
			include: {
				finishes: true;
			};
		};
		images: true;
	};
}>;

export class ListingsRepository implements IListingsRepository {
	constructor(private readonly _client: DbClient) {}

	async create(listing: DomainListing): Promise<DomainListing> {
		const { building, images, ...restListing } = ListingMapper.toPersistenceFromDomain(listing);
		const { finishes, ...restBuilding } = building;

		const result = await PrismaService.executeOrThrow(() =>
			this._client.listing.create({
				data: {
					...restListing,
					images: {
						connect: images.map((img) => ({ id: img.id }))
					},
					building: {
						create: {
							...restBuilding,
							finishes: {
								create: finishes
							}
						}
					}
				},
				include: {
					images: true,
					building: {
						include: {
							finishes: true
						}
					}
				}
			})
		);

		return this.toDomainFromPrisma(result);
	}

	async save(listing: DomainListing, newImages: Image[]): Promise<DomainListing> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { building, images, ...restListing } = ListingMapper.toPersistenceFromDomain(listing);
		const { finishes, ...restBuilding } = building;

		const restListingWithoutId = omitId(restListing);
		const restBuildingWithoutId = omitId(restBuilding);

		const result = await PrismaService.executeOrThrow(() =>
			this._client.listing.update({
				where: { id: listing.id.value },
				data: {
					...restListingWithoutId,
					images: {
						connect: newImages.map((img) => ({ id: img.id.value }))
					},
					building: {
						update: {
							...restBuildingWithoutId,

							finishes: {
								deleteMany: {},
								create: finishes.map((finish) => ({
									id: finish.id,
									description: finish.description,
									type: finish.type,
									price: finish.price,
									originalPrice: finish.originalPrice,
									createdAt: finish.createdAt,
									updatedAt: finish.updatedAt,
									deletedAt: finish.deletedAt,
									createdById: finish.createdById,
									updatedById: finish.updatedById,
									deletedById: finish.deletedById ?? null
								}))
							}
						}
					}
				},
				include: {
					images: true,
					building: {
						include: { finishes: true }
					}
				}
			})
		);

		if (!result.building) {
			throw new Error('Building not found for listing');
		}

		return this.toDomainFromPrisma(result);
	}

	async getById(id: ListingId): Promise<DomainListing | null> {
		const record = await PrismaService.safeExecuteOrThrow(() =>
			this._client.listing.findUnique({
				where: {
					id: id.value
				},
				include: {
					images: {
						where: {
							status: {
								not: PrismaImageStatus.DELETED
							}
						}
					},
					building: {
						include: { finishes: true }
					}
				}
			})
		);

		if (!record) {
			return null;
		}

		return this.toDomainFromPrisma(record);
	}

	async delete(id: ListingId): Promise<void> {
		await PrismaService.executeOrThrow(() =>
			this._client.listing.delete({
				where: { id: id.value }
			})
		);
	}

	async find(options?: ListingQueryOptions) {
		const orderBy =
			options?.sort?.type === 'listing'
				? this.buildListingOrderBy(options.sort.sort)
				: options?.sort?.type === 'building'
					? { building: this.buildBuildingOrderBy(options.sort.sort) }
					: options?.sort?.type === 'finish'
						? { building: { finishes: this.buildFinishOrderBy(options.sort.sort) } }
						: {};

		const record = await PrismaService.executeOrThrow(() =>
			this._client.listing.findMany({
				where: {
					...this.buildListingWhere(options?.filters?.listing),
					building: {
						...this.buildBuildingWhere,
						finishes: {
							...this.buildFinishWhere
						}
					}
				},
				orderBy,
				include: {
					images: true,
					building: {
						include: {
							finishes: true
						}
					}
				},
				take: options?.pagination?.limit,
				skip: options?.pagination?.offset
			})
		);

		return record.map((r) => {
			return this.toDomainFromPrisma(r);
		});
	}

	private buildListingWhere(filters?: ListingFilterOptions): Prisma.ListingWhereInput {
		const where: Prisma.ListingWhereInput = {};

		if (!filters?.includesDeleted) {
			where.deletedAt = null;
		} else {
			return where;
		}

		if (filters?.title) {
			where.title = { contains: filters.title };
		}

		return where;
	}

	private buildFinishWhere(filters?: FinishFilterOptions): Prisma.FinishWhereInput {
		const where: Prisma.FinishWhereInput = {};

		if (filters?.includesDeleted) {
			return where;
		} else {
			where.deletedAt = null;
		}

		if (!filters) return where;

		if (filters.type) {
			where.type = finishTypePrismaMap[filters.type];
		}

		if (filters.price_from) {
			where.price = {
				gte: filters.price_from
			};
		}

		if (filters.price_to) {
			where.price = {
				lte: filters.price_to
			};
		}

		if (filters.description) {
			where.description = filters.description;
		}

		return where;
	}

	private buildBuildingWhere(filters?: BuildingFilterOptions): Prisma.BuildingWhereInput {
		const where: Prisma.BuildingWhereInput = {};

		if (filters?.includesDeleted) {
			return where;
		} else {
			where.deletedAt = null;
		}

		if (!filters) return where;

		if (filters.constructionType) {
			where.constructionType = filters.constructionType;
		}

		if (filters.width) {
			where.width = filters.width;
		}

		if (filters.length) {
			where.length = filters.length;
		}

		if (filters.height) {
			where.height = filters.height;
		}

		if (filters.bedrooms) {
			where.bedrooms = filters.bedrooms;
		}

		if (filters.bathrooms) {
			where.bathrooms = filters.bathrooms;
		}

		if (filters.floors) {
			where.floors = filters.floors;
		}

		if (filters.hasVeranda) {
			where.hasVeranda = filters.hasVeranda;
		}

		return where;
	}

	private buildListingOrderBy(
		sort?: SortOptions<ListingSortableFields>
	): Prisma.ListingOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}

	private buildFinishOrderBy(
		sort?: SortOptions<FinishSortableFields>
	): Prisma.FinishOrderByRelationAggregateInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}

	private buildBuildingOrderBy(
		sort?: SortOptions<BuildingSortableFields>
	): Prisma.BuildingOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}

	private toDomainFromPrisma(record: ListingWithRelations): DomainListing {
		return ListingMapper.toDomainFromPersistence({
			...record,
			images: record.images.map((image) => ({
				id: image.id,
				folder: image.folder,
				key: image.key,
				bucket: image.bucket,
				status: imageStatusPrismaMap[image.status],
				createdAt: image.createdAt,
				updatedAt: image.updatedAt,
				deletedAt: image.deletedAt,
				createdById: image.createdById,
				updatedById: image.updatedById,
				deletedById: image.deletedById ?? null
			})),
			building: {
				...record.building!,
				constructionType: constructionTypePrismaMap[record.building!.constructionType],
				finishes: record.building!.finishes.map((f) => ({
					...f,
					type: finishTypePrismaMap[f.type]
				}))
			}
		});
	}
}

let listingsRepository: IListingsRepository | null = null;

export const getListingsRepository = (client: DbClient) => {
	if (!listingsRepository) {
		listingsRepository = new ListingsRepository(client);
	}
	return listingsRepository;
};
