import { Finish as DomainFinish } from './finish.domain';
import type { Prisma } from '$lib/server/api/prisma/generated/client';
import {
	FinishSortableFields,
	type FinishFilterOptions,
	type FinishQueryOptions,
	type FinishWithId,
	type IFinishesRepository
} from '$lib/types/finishes/finishes.repository.types';
import {
	SortDirection,
	type DbClient,
	type SortOptions
} from '$lib/types/prisma/prisma.service.types';
import { FinishMapper, finishTypePrismaMap } from './finish.mapper';

export class FinishesRepository implements IFinishesRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IFinishesRepository {
		return new FinishesRepository(client);
	}

	async create(buildingId: number, finish: DomainFinish): Promise<FinishWithId> {
		const record = await this._client.finish.create({
			data: {
				...FinishMapper.toPrismaCreateFromDomain(finish),
				building: {
					connect: { id: buildingId }
				}
			}
		});

		return {
			finish: FinishMapper.toDomainFromPrisma(record),
			id: record.id
		};
	}

	async update(id: number, finish: DomainFinish): Promise<FinishWithId> {
		const model = FinishMapper.toPrismaFromDomain(finish);

		const record = await this._client.finish.update({
			where: {
				id
			},
			data: model
		});

		return {
			finish: FinishMapper.toDomainFromPrisma(record),
			id: record.id
		};
	}

	async delete(id: number): Promise<void> {
		await this._client.finish.delete({
			where: {
				id
			}
		});
	}

	async findAll(options: FinishQueryOptions): Promise<FinishWithId[]> {
		const records = await this._client.finish.findMany({
			where: this.buildWhere(options.filters),
			orderBy: this.buildOrderBy(options.sort),
			take: options.pagination?.limit,
			skip: options.pagination?.offset
		});

		return records.map((r) => ({
			finish: FinishMapper.toDomainFromPrisma(r),
			id: r.id
		}));
	}

	async findAllCount(options: FinishFilterOptions): Promise<number> {
		return await this._client.finish.count({
			where: this.buildWhere(options)
		});
	}

	async getById(id: number): Promise<FinishWithId | null> {
		const record = await this._client.finish.findUnique({
			where: {
				id
			}
		});

		if (!record) return null;

		return {
			finish: FinishMapper.toDomainFromPrisma(record),
			id: record.id
		};
	}

	private buildOrderBy(
		sort?: SortOptions<FinishSortableFields>
	): Prisma.FinishOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}

	private buildWhere(filters?: FinishFilterOptions): Prisma.FinishWhereInput {
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

		if (filters.buildingId) {
			where.buildingId = filters.buildingId;
		}

		return where;
	}
}

let finishesRepository: IFinishesRepository | null = null;

export const getFinishesRepository = (client: DbClient) => {
	if (!finishesRepository) {
		finishesRepository = new FinishesRepository(client);
	}
	return finishesRepository;
};
