import { Building as DomainBuilding } from './building.domain';
import type {
	BuildingFilterOptions,
	BuildingQueryOptions,
	BuildingSortableFields,
	IBuildingsRepository
} from './building.types';
import type {
	Prisma,
	ConstructionType as PrismaConstructionType,
	Building as PrismaBuilding
} from '$lib/server/prisma/generated/client';
import { ConstructionType as DomainConstructionType } from './building.domain';
import { SortDirection, type DbClient, type SortOptions } from '$lib/server/prisma/prisma.types';

const constructionTypeMap: Record<PrismaConstructionType, DomainConstructionType> = {
	FRAME: DomainConstructionType.FRAME,
	BARN: DomainConstructionType.BARN,
	CONTAINER: DomainConstructionType.CONTAINER
};

export class BuildingsRepository implements IBuildingsRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IBuildingsRepository {
		return new BuildingsRepository(client);
	}

	async getById(id: number): Promise<DomainBuilding | null> {
		const record = await this._client.building.findUnique({
			where: { id }
		});

		if (!record) return null;

		return this.toDomainBuilding(record);
	}

	async findAll(options?: BuildingQueryOptions): Promise<DomainBuilding[]> {
		const records = await this._client.building.findMany({
			where: this.buildWhere(options?.filters),
			orderBy: this.buildOrderBy(options?.sort),
			take: options?.pagination?.limit,
			skip: options?.pagination?.offset
		});

		return records.map((r) => this.toDomainBuilding(r));
	}

	async findAllCount(filters?: BuildingFilterOptions): Promise<number> {
		const count = await this._client.building.count({
			where: this.buildWhere(filters)
		});
		return count;
	}

	async create(building: DomainBuilding): Promise<DomainBuilding> {
		const record = await this._client.building.create({
			data: {
				constructionType: building.constructionType,
				width: building.width,
				length: building.length,
				height: building.height,
				bedrooms: building.bedrooms,
				bathrooms: building.bathrooms,
				floors: building.floors,
				veranda: building.veranda,
				createdAt: building.createdAt,
				updatedAt: building.updatedAt,
				deletedAt: building.deletedAt,
				createdById: building.createdById,
				updatedById: building.updatedById,
				deletedById: building.deletedById
			}
		});

		return this.toDomainBuilding(record);
	}

	async update(building: DomainBuilding): Promise<DomainBuilding> {
		if (!building.id) {
			throw new Error('Building ID is required for update');
		}

		const model = this.toPrismaBuildingNoId(building);

		const record = await this._client.building.update({
			where: { id: building.id },
			data: {
				...model
			}
		});

		return this.toDomainBuilding(record);
	}

	async softDelete(building: DomainBuilding): Promise<void> {
		await this._client.building.update({
			where: {
				id: building.id!
			},
			data: {
				deletedAt: building.deletedAt,
				deletedById: building.deletedById
			}
		});

		return;
	}

	async delete(building: DomainBuilding): Promise<void> {
		await this._client.building.delete({
			where: { id: building.id! }
		});

		return;
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

	private toDomainBuilding(record: PrismaBuilding): DomainBuilding {
		return DomainBuilding.fromPersistence({
			...record,
			constructionType: constructionTypeMap[record.constructionType]
		});
	}

	private toPrismaBuildingNoId(building: DomainBuilding): Omit<PrismaBuilding, 'id'> {
		return {
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			veranda: building.veranda,
			createdAt: building.createdAt,
			updatedAt: building.updatedAt,
			deletedAt: building.deletedAt,
			createdById: building.createdById,
			updatedById: building.updatedById,
			deletedById: building.deletedById
		};
	}
}

let buildingsRepository: IBuildingsRepository | null = null;

export const getBuildingsRepository = (client: DbClient) => {
	if (!buildingsRepository) {
		buildingsRepository = new BuildingsRepository(client);
	}
	return buildingsRepository;
};
