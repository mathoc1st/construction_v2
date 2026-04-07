import type { Prisma } from '$lib/server/api/prisma/generated/client';
import {
	SortDirection,
	type DbClient,
	type SortOptions
} from '$lib/types/prisma/prisma.service.types';
import { Listing } from './listing.domain';
import type {
	IListingsRepository,
	ListingFilterOptions,
	ListingQueryOptions,
	ListingSortableFields,
	ListingWithId,
	ListingWithRelations
} from '$lib/types/listings/listings.repository.types';
import { ListingMapper } from './listing.mapper';
import { BuildingMapper } from '../buildings/building.mapper';
import { FinishMapper } from '../finishes/finish.mapper';
import type { Building } from '../buildings/building.domain';
import type { Finish } from '../finishes/finish.domain';
import type { ConstructionType } from '$lib/types/buildings/building.domain.types';

export class ListingsRepository implements IListingsRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IListingsRepository {
		return new ListingsRepository(client);
	}

	async getListingByIdWithRelations(
		id: number,
		includesDeleted?: boolean
	): Promise<ListingWithRelations | null> {
		const record = await this._client.listing.findUnique({
			where: {
				id
			},
			include: {
				building: {
					where: includesDeleted ? undefined : { deletedAt: null },
					include: {
						finishes: {
							where: includesDeleted ? undefined : { deletedAt: null }
						}
					}
				}
			}
		});

		if (!record) return null;

		return {
			listing: {
				id: record.id,
				record: ListingMapper.toDomainFromPrisma(record)
			},
			building: record.building
				? {
						id: record.building.id,
						record: BuildingMapper.toDomainFromPrisma(record.building)
					}
				: null,
			finishes:
				record.building?.finishes.map((f) => ({
					id: f.id,
					record: FinishMapper.toDomainFromPrisma(f)
				})) || []
		};
	}

	async findListingsByBuildingType(
		type: ConstructionType,
		options?: ListingQueryOptions
	): Promise<ListingWithRelations[]> {
		const records = await this._client.listing.findMany({
			where: {
				...this.buildWhere(options?.filters),
				building: {
					constructionType: type,
					deletedAt: options?.filters?.includesDeleted ? undefined : null
				}
			},
			orderBy: this.buildOrderBy(options?.sort),
			take: options?.pagination?.limit,
			skip: options?.pagination?.offset,
			include: {
				building: {
					include: {
						finishes: true
					}
				}
			}
		});

		return records.map((record) => ({
			listing: {
				id: record.id,
				record: ListingMapper.toDomainFromPrisma(record)
			},
			building: record.building
				? {
						id: record.building.id,
						record: BuildingMapper.toDomainFromPrisma(record.building)
					}
				: null,
			finishes:
				record.building?.finishes.map((f) => ({
					id: f.id,
					record: FinishMapper.toDomainFromPrisma(f)
				})) || []
		}));
	}

	async getListingById(id: number): Promise<ListingWithId | null> {
		const record = await this._client.listing.findUnique({
			where: {
				id
			}
		});

		if (!record) return null;

		return {
			id: record.id,
			listing: ListingMapper.toDomainFromPrisma(record)
		};
	}

	async getBuildingIdByListingId(id: number): Promise<number | null> {
		const record = await this._client.listing.findUnique({
			where: {
				id
			},
			select: {
				building: true
			}
		});

		if (!record || !record.building) return null;

		return record.building.id;
	}

	async findAll(options?: ListingQueryOptions): Promise<ListingWithId[]> {
		const record = await this._client.listing.findMany({
			where: this.buildWhere(options?.filters),
			orderBy: this.buildOrderBy(options?.sort),
			take: options?.pagination?.limit,
			skip: options?.pagination?.offset
		});

		return record.map((r) => ({
			id: r.id,
			listing: ListingMapper.toDomainFromPrisma(r)
		}));
	}

	async create(buildingId: number, listing: Listing): Promise<ListingWithId> {
		const model = ListingMapper.toPrismaCreateFromDomain(listing);
		const record = await this._client.listing.create({
			data: {
				...model,
				building: {
					connect: { id: buildingId }
				}
			}
		});

		return {
			id: record.id,
			listing: ListingMapper.toDomainFromPrisma(record)
		};
	}

	async createListingWithRelations(
		listing: Listing,
		building: Building,
		finishes: Finish[]
	): Promise<ListingWithRelations> {
		const record = await this._client.listing.create({
			data: {
				...ListingMapper.toPrismaCreateFromDomain(listing),
				building: {
					create: {
						...BuildingMapper.toPrismaCreateFromDomain(building),
						finishes: {
							create: finishes.map((f) => FinishMapper.toPrismaCreateFromDomain(f))
						}
					}
				}
			},
			include: {
				building: {
					include: {
						finishes: true
					}
				}
			}
		});

		return {
			listing: {
				id: record.id,
				record: ListingMapper.toDomainFromPrisma(record)
			},
			building: record.building
				? {
						id: record.building.id,
						record: BuildingMapper.toDomainFromPrisma(record.building)
					}
				: null,
			finishes:
				record.building?.finishes.map((f) => ({
					id: f.id,
					record: FinishMapper.toDomainFromPrisma(f)
				})) || []
		};
	}

	async update(id: number, listing: Listing): Promise<ListingWithId> {
		const model = ListingMapper.toPrismaFromDomain(listing);

		const record = await this._client.listing.update({
			where: {
				id
			},
			data: model
		});

		return {
			id: record.id,
			listing: ListingMapper.toDomainFromPrisma(record)
		};
	}

	async delete(id: number): Promise<void> {
		await this._client.listing.delete({ where: { id } });
	}

	private buildWhere(filters?: ListingFilterOptions): Prisma.ListingWhereInput {
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

	private buildOrderBy(
		sort?: SortOptions<ListingSortableFields>
	): Prisma.ListingOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}
}

let listingsRepository: IListingsRepository | null = null;

export const getListingsRepository = (client: DbClient) => {
	if (!listingsRepository) {
		listingsRepository = new ListingsRepository(client);
	}
	return listingsRepository;
};
