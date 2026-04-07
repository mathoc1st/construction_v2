import { Building as DomainBuilding } from './building.domain';
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

export class BuildingsRepository implements IBuildingsRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IBuildingsRepository {
		return new BuildingsRepository(client);
	}

	async getById(id: number): Promise<BuildingWithId | null> {
		const record = await this._client.building.findUnique({
			where: { id }
		});

		if (!record) return null;

		return {
			id: record.id,
			building: BuildingMapper.toDomainFromPrisma(record)
		};
	}

	async findAll(options?: BuildingQueryOptions): Promise<BuildingWithId[]> {
		const records = await this._client.building.findMany({
			where: this.buildWhere(options?.filters),
			orderBy: this.buildOrderBy(options?.sort),
			take: options?.pagination?.limit,
			skip: options?.pagination?.offset
		});

		return records.map((r) => ({
			id: r.id,
			building: BuildingMapper.toDomainFromPrisma(r)
		}));
	}

	async findAllCount(filters?: BuildingFilterOptions): Promise<number> {
		const count = await this._client.building.count({
			where: this.buildWhere(filters)
		});
		return count;
	}

	async create(listingId: number, building: DomainBuilding): Promise<BuildingWithId> {
		const record = await this._client.building.create({
			data: {
				...BuildingMapper.toPrismaCreateFromDomain(building),
				listing: {
					connect: { id: listingId }
				}
			}
		});

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

		if (filters.veranda) {
			where.veranda = filters.veranda;
		}

		return where;
	}
}

let buildingsRepository: IBuildingsRepository | null = null;

export const getBuildingsRepository = (client: DbClient) => {
	if (!buildingsRepository) {
		buildingsRepository = new BuildingsRepository(client);
	}
	return buildingsRepository;
};
