import { EntityNotFoundError } from '../common/errors/errors.service';
import { Finish } from './finish.domain';
import type {
	AddFinishParams,
	DeleteFinishParams,
	IFinishesService,
	IFinishesRepository,
	UpdateFinishParams
} from './finish.types';

export class FinishesService implements IFinishesService {
	constructor(private readonly finishesRepository: IFinishesRepository) {}

	async addFinish(params: AddFinishParams): Promise<Finish> {
		const newFinish = Finish.create({
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice,
			buildingId: params.buildingId,
			createdById: params.performedBy.id!
		});

		const createdFinish = this.finishesRepository.create(newFinish);

		return createdFinish;
	}
	async updateFinish(params: UpdateFinishParams): Promise<Finish> {
		const finish = await this.finishesRepository.getById(params.targetId);

		if (!finish) throw new EntityNotFoundError('Finish', params.targetId);

		if (params.description) finish.changeDescription(params.description, params.performedById);
		if (params.price) finish.changePrice(params.price, params.performedById);
		if (params.originalPrice)
			finish.changeOriginalPrice(params.originalPrice, params.performedById);

		const updatedFinish = await this.finishesRepository.update(finish);

		return updatedFinish;
	}

	async deleteFinish(params: DeleteFinishParams): Promise<void> {
		const finish = await this.finishesRepository.getById(params.targetId);

		if (!finish) throw new EntityNotFoundError('Finish', params.targetId);

		finish.markDeleted(params.performedById);

		await this.finishesRepository.update(finish);
	}
}
