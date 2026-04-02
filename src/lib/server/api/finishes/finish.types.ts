import type { DbClient, PaginationOptions, SortOptions } from '$lib/server/prisma/prisma.types';
import type { User } from '../users/user.domain';
import type { Finish } from './finish.domain';

export enum FinishType {
	COLD = 'COLD',
	WARM_100 = 'WARM_100',
	WARM_150 = 'WARM_150',
	WARM_200 = 'WARM_200'
}

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
};

export type FinishQueryOptions = {
	filters?: FinishFilterOptions;
	sort?: SortOptions<FinishSortableFields>;
	pagination?: PaginationOptions;
};

export interface IFinishesRepository {
	withClient(client: DbClient): IFinishesRepository;
	create(finish: Finish): Promise<Finish>;
	update(finish: Finish): Promise<Finish>;
	delete(finish: Finish): Promise<void>;
	findAll(options: FinishQueryOptions): Promise<Finish[]>;
	findAllCount(options: FinishFilterOptions): Promise<number>;
	getById(id: number): Promise<Finish | null>;
}

export type AddFinishParams = {
	type: FinishType;
	description: string;
	price: number;
	buildingId: number;
	originalPrice?: number;
	performedBy: User;
};

export type UpdateFinishParams = {
	description?: string;
	price?: number;
	originalPrice?: number;
	targetId: number;
	performedById: number;
};

export type DeleteFinishParams = {
	targetId: number;
	performedById: number;
};

export interface IFinishesService {
	addFinish(params: AddFinishParams): Promise<Finish>;
	updateFinish(params: UpdateFinishParams): Promise<Finish>;
	deleteFinish(params: DeleteFinishParams): Promise<void>;
}
