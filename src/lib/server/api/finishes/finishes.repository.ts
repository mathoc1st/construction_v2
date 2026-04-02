import { Finish as DomainFinish } from './finish.domain';
import type { Prisma, Finish as PrismaFinish } from '$lib/server/prisma/generated/client';
import {
	FinishType as DomainFinishType,
	FinishSortableFields,
	type FinishFilterOptions,
	type FinishQueryOptions,
	type IFinishesRepository
} from './finish.types';
import { FinishType as PrismaFinishType } from '$lib/server/prisma/generated/enums';
import { SortDirection, type DbClient, type SortOptions } from '$lib/server/prisma/prisma.types';

const finishTypeMap: Record<PrismaFinishType, DomainFinishType> = {
	COLD: DomainFinishType.COLD,
	WARM_100: DomainFinishType.WARM_100,
	WARM_150: DomainFinishType.WARM_150,
	WARM_200: DomainFinishType.WARM_200
};

export class FinishesRepository implements IFinishesRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IFinishesRepository {
		return new FinishesRepository(client);
	}

	async create(finish: DomainFinish): Promise<DomainFinish> {
		const record = await this._client.finish.create({
			data: this.toPrismaFinish(finish)
		});

		return this.toDomainFinish(record);
	}

	async update(finish: DomainFinish): Promise<DomainFinish> {
		if (!finish.id) throw new Error('Cannot update finish without an id');
		const record = await this._client.finish.update({
			where: {
				id: finish.id
			},
			data: this.toPrismaFinish(finish)
		});

		return this.toDomainFinish(record);
	}

	async delete(finish: DomainFinish): Promise<void> {
		if (!finish.id) throw new Error('Cannot delete finish without an id');
		await this._client.finish.delete({
			where: {
				id: finish.id
			}
		});
	}

	async findAll(options: FinishQueryOptions): Promise<DomainFinish[]> {
		const records = await this._client.finish.findMany({
			where: this.buildWhere(options.filters),
			orderBy: this.buildOrderBy(options.sort),
			take: options.pagination?.limit,
			skip: options.pagination?.offset
		});

		return records.map((r) => this.toDomainFinish(r));
	}

	async findAllCount(options: FinishFilterOptions): Promise<number> {
		return await this._client.finish.count({
			where: this.buildWhere(options)
		});
	}

	async getById(id: number): Promise<DomainFinish | null> {
		const record = await this._client.finish.findUnique({
			where: {
				id
			}
		});

		if (!record) return null;

		return this.toDomainFinish(record);
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

		if (!filters) return where;

		if (filters.type) {
			where.type = filters.type;
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

	private toPrismaFinish(finish: DomainFinish): Omit<PrismaFinish, 'id'> {
		return {
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice,
			buildingId: finish.buildingId,
			createdAt: finish.createdAt,
			updatedAt: finish.updatedAt,
			deletedAt: finish.deletedAt,
			createdById: finish.createdById,
			updatedById: finish.updatedById,
			deletedById: finish.deletedById
		};
	}

	private toDomainFinish(finish: PrismaFinish): DomainFinish {
		return DomainFinish.fromPersistence({
			...finish,
			type: finishTypeMap[finish.type]
		});
	}
}
