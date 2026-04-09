import { Finish as DomainFinish, FinishId } from './finish.domain';
import { type FinishPersistence } from '$lib/types/finishes/finish.domain.types';
import { UserId } from '../users/user.domain';
import type { FinishDto } from '$lib/dtos/finish.dto';

export class FinishMapper {
	static toDomainFromPersistence(record: FinishPersistence): DomainFinish {
		return DomainFinish.fromPersistence({
			...record,
			id: new FinishId(record.id),
			createdById: new UserId(record.createdById),
			updatedById: new UserId(record.updatedById),
			deletedById: record.deletedById ? new UserId(record.deletedById) : null
		});
	}

	static toDtoFromDomain(finish: DomainFinish): FinishDto {
		return {
			id: finish.id.value,
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice
		};
	}
}
