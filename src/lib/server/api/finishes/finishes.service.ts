import { getPrismaService } from '$lib/server/api/prisma/prisma.service';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { Finish } from './finish.domain';
import type {
	AddFinishParams,
	DeleteFinishParams,
	IFinishesService,
	UpdateFinishParams,
	ReconcileFinishParams
} from '$lib/types/finishes/finishes.service.types';
import { getFinishesRepository } from './finishes.repository';
import type {
	FinishWithId,
	IFinishesRepository
} from '$lib/types/finishes/finishes.repository.types';

export class FinishesService implements IFinishesService {
	constructor(private readonly finishesRepository: IFinishesRepository) {}

	withRepository(repository: IFinishesRepository): IFinishesService {
		return new FinishesService(repository);
	}

	async addFinish(params: AddFinishParams): Promise<FinishWithId> {
		const newFinish = Finish.create({
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice,
			createdById: params.performedById
		});

		const createdFinish = await this.finishesRepository.create(params.buildingId, newFinish);

		return createdFinish;
	}
	async updateFinish(params: UpdateFinishParams): Promise<FinishWithId> {
		const finishWithId = await this.finishesRepository.getById(params.id);

		if (!finishWithId) throw new EntityNotFoundError('Finish', params.id);

		const { finish } = finishWithId;

		if (params.description) finish.changeDescription(params.description, params.performedById);
		if (params.price !== undefined) finish.changePrice(params.price, params.performedById);
		if (params.originalPrice !== undefined && params.originalPrice !== null)
			finish.changeOriginalPrice(params.originalPrice, params.performedById);

		const updatedFinish = await this.finishesRepository.update(params.id, finish);

		return updatedFinish;
	}

	async deleteFinish(params: DeleteFinishParams): Promise<void> {
		const finishWithId = await this.finishesRepository.getById(params.targetId);

		if (!finishWithId) throw new EntityNotFoundError('Finish', params.targetId);

		await this.finishesRepository.delete(params.targetId);
	}

	async softDeleteFinish(params: DeleteFinishParams): Promise<FinishWithId> {
		const finishWithId = await this.finishesRepository.getById(params.targetId);

		if (!finishWithId) throw new EntityNotFoundError('Finish', params.targetId);

		const { finish } = finishWithId;

		finish.markDeleted(params.performedById);

		return await this.finishesRepository.update(params.targetId, finish);
	}

	async reconcileFinishes(params: ReconcileFinishParams): Promise<FinishWithId[]> {
		const reconciledFinishes: FinishWithId[] = [];

		const finishWithId = await this.finishesRepository.findAll({
			filters: {
				buildingId: params.buildingId
			}
		});

		const existingFinishIds = finishWithId.map((f) => f.id);
		const incomingFinishIds = params.finishes.map((f) => f.targetId);

		const existingSet = new Set(existingFinishIds);
		const incomingSet = new Set(incomingFinishIds);

		const toDelete = existingFinishIds.filter((id) => !incomingSet.has(id));
		const toAdd = params.finishes.filter((f) => {
			return f.targetId === undefined || f.targetId === null || !existingSet.has(f.targetId);
		});
		const toUpdate = params.finishes.filter(
			(f) => f.targetId !== undefined && f.targetId !== null && existingSet.has(f.targetId)
		);

		for (const id of toDelete) {
			await this.softDeleteFinish({ targetId: id, performedById: params.performedById });
		}

		for (const finish of toAdd) {
			const newFinish = Finish.create({
				type: finish.type!,
				description: finish.description!,
				price: finish.price!,
				originalPrice: finish.originalPrice,
				createdById: params.performedById
			});

			const finishWithId = await this.finishesRepository.create(params.buildingId, newFinish);

			reconciledFinishes.push(finishWithId);
		}

		for (const finish of toUpdate) {
			const finishWithId = await this.updateFinish({
				id: finish.targetId!,
				type: finish.type,
				description: finish.description,
				price: finish.price,
				originalPrice: finish.originalPrice,
				performedById: params.performedById
			});

			reconciledFinishes.push(finishWithId);
		}

		return reconciledFinishes;
	}
}

let finishesService: IFinishesService | null = null;

export const getFinishesService = () => {
	const prismaService = getPrismaService();

	if (!finishesService) {
		finishesService = new FinishesService(getFinishesRepository(prismaService.client));
	}
	return finishesService;
};
