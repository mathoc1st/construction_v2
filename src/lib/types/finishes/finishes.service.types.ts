import type { FinishId } from '$lib/server/api/finishes/finish.domain';
import type { FinishType } from './finish.domain.types';
import type { FinishWithId, IFinishesRepository } from './finishes.repository.types';

export type AddFinishParams = {
	type: FinishType;
	description: string;
	price: number;
	originalPrice?: number | null;
};

export type UpdateFinishParams = {
	id?: FinishId;
	type: FinishType;
	description?: string;
	price?: number;
	originalPrice?: number | null;
};

export type ReconcileFinishParams = {
	finishes: (Omit<UpdateFinishParams, 'performedById' | 'targetId'> & {
		targetId?: number;
	})[];
	buildingId: number;
	performedById: number;
};

export type DeleteFinishParams = {
	targetId: number;
	performedById: number;
};

export interface IFinishesService {
	withRepository(repository: IFinishesRepository): IFinishesService;
	addFinish(params: AddFinishParams): Promise<FinishWithId>;
	updateFinish(params: UpdateFinishParams): Promise<FinishWithId>;
	softDeleteFinish(params: DeleteFinishParams): Promise<FinishWithId>;
	deleteFinish(params: DeleteFinishParams): Promise<void>;
	reconcileFinishes(params: ReconcileFinishParams): Promise<FinishWithId[]>;
}
