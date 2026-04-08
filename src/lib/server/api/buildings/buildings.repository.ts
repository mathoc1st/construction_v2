import { BuildingId, Building as DomainBuilding } from './building.domain';
import type {
	BuildingFilterOptions,
	BuildingQueryOptions,
	BuildingSortableFields,
	BuildingWithId,
	IBuildingsRepository
} from '$lib/types/buildings/buildings.repository.types';
import type { Prisma } from '$lib/server/api/prisma/generated/client';
import {
	SortDirection,
	type DbClient,
	type SortOptions
} from '$lib/types/prisma/prisma.service.types';
import { BuildingMapper } from './building.mapper';
import { ConstructionType as DomainConstructionType } from '$lib/types/buildings/building.domain.types';
import { ConstructionType as PrismaConstructionType } from '$lib/server/api/prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ListingId } from '../listings/listing.domain';

export class PrismaBuildingsRepository implements IBuildingsRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IBuildingsRepository {
		return new PrismaBuildingsRepository(client);
	}

	async getById(id: BuildingId): Promise<DomainBuilding | null> {
		const record = await PrismaService.safeExecuteOrThrow(() =>
			this._client.building.findUnique({
				where: { id: id.value }
			})
		);

		if (!record) return null;

		return BuildingMapper.toDomainFromPersistence({
			...record,
			constructionType: constructionTypePrismaMap[record.constructionType]
		});
	}

	async findAll(options?: BuildingQueryOptions): Promise<DomainBuilding[]> {
		const records = await PrismaService.executeOrThrow(() =>
			this._client.building.findMany({
				where: this.buildWhere(options?.filters),
				orderBy: this.buildOrderBy(options?.sort),
				take: options?.pagination?.limit,
				skip: options?.pagination?.offset
			})
		);

		return records.map((r) =>
			BuildingMapper.toDomainFromPersistence({
				...r,
				constructionType: constructionTypePrismaMap[r.constructionType]
			})
		);
	}

	async findAllCount(filters?: BuildingFilterOptions): Promise<number> {
		const count = await PrismaService.executeOrThrow(() =>
			this._client.building.count({
				where: this.buildWhere(filters)
			})
		);
		return count;
	}

	async create(listingId: ListingId, building: DomainBuilding): Promise<BuildingWithId> {
		const record = await PrismaService.executeOrThrow(() =>
			this._client.building.create({
				data: {
					...BuildingMapper.toPersistenceFromDomain(building),
					listingId: listingId.value
				}
			})
		);

		return {
			id: record.id,
			building: BuildingMapper.toDomainFromPrisma(record)
		};
	}

	async update(id: number, building: DomainBuilding): Promise<BuildingWithId> {
		const model = BuildingMapper.toPrismaFromDomain(building);

		const record = await this._client.building.update({
			where: { id },
			data: {
				...model
			}
		});

		return {
			id: record.id,
			building: BuildingMapper.toDomainFromPrisma(record)
		};
	}

	async delete(id: number): Promise<void> {
		await this._client.building.delete({
			where: { id }
		});
	}

	private buildOrderBy(
		sort?: SortOptions<BuildingSortableFields>
	): Prisma.BuildingOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}

	private buildWhere(filters?: BuildingFilterOptions): Prisma.BuildingWhereInput {
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
			where.veranda = filters.hasVeranda;
		}

		return where;
	}
}

let buildingsRepository: IBuildingsRepository | null = null;

export const getBuildingsRepository = (client: DbClient) => {
	if (!buildingsRepository) {
		buildingsRepository = new PrismaBuildingsRepository(client);
	}
	return buildingsRepository;
};
