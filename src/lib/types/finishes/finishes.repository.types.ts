import type { Finish } from '$lib/server/api/finishes/finish.domain';
import type { DbClient, PaginationOptions, SortOptions } from '../prisma/prisma.service.types';
import type { FinishType } from './finish.domain.types';

export type FinishWithId = {
	finish: Finish;
	id: number;
};

export enum FinishSortableFields {
	TYPE = 'type',
	PRICE = 'price',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETED_AT = 'deletedAt'
}

export type FinishFilterOptions = {
	type?: FinishType;
	price_from?: number;
	price_to?: number;
	description?: string;
	buildingId?: number;
	includesDeleted?: boolean;
};

export type FinishQueryOptions = {
	filters?: FinishFilterOptions;
	sort?: SortOptions<FinishSortableFields>;
	pagination?: PaginationOptions;
};

export interface IFinishesRepository {
	withClient(client: DbClient): IFinishesRepository;
	create(buildingId: number, finish: Finish): Promise<FinishWithId>;
	update(id: number, finish: Finish): Promise<FinishWithId>;
	delete(id: number): Promise<void>;
	findAll(options: FinishQueryOptions): Promise<FinishWithId[]>;
	findAllCount(options: FinishFilterOptions): Promise<number>;
	getById(id: number): Promise<FinishWithId | null>;
}
