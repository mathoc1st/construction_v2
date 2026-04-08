import { Finish as DomainFinish, FinishId } from './finish.domain';
import { type FinishPersistence } from '$lib/types/finishes/finish.domain.types';
import { UserId } from '../users/user.domain';

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
}
