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

// static toDtoFromDomainWithId(id: number, finish: DomainFinish): FinishDto {
// 	return {
// 		id,
// 		type: finish.type,
// 		description: finish.description,
// 		price: finish.price,
// 		originalPrice: finish.originalPrice
// 	};
// }

// static toDomainFromPrisma(record: PrismaFinish): DomainFinish {
// 	return DomainFinish.fromPersistence({
// 		...record,
// 		type: finishTypePrismaMap[record.type]
// 	});
// }

// static toPrismaFromDomain(finish: DomainFinish): Omit<PrismaFinish, 'id' | 'buildingId'> {
// 	return {
// 		type: finish.type,
// 		description: finish.description,
// 		price: finish.price,
// 		originalPrice: finish.originalPrice,
// 		createdAt: finish.createdAt,
// 		updatedAt: finish.updatedAt,
// 		deletedAt: finish.deletedAt,
// 		createdById: finish.createdById,
// 		updatedById: finish.updatedById,
// 		deletedById: finish.deletedById
// 	};
// }

// static toPrismaCreateFromDomain(
// 	finish: DomainFinish
// ): Omit<Prisma.FinishCreateInput, 'building'> {
// 	return {
// 		type: finish.type,
// 		description: finish.description,
// 		price: finish.price,
// 		originalPrice: finish.originalPrice,
// 		createdBy: {
// 			connect: { id: finish.createdById }
// 		},
// 		updatedBy: {
// 			connect: { id: finish.updatedById }
// 		},
// 		deletedBy: finish.deletedById
// 			? {
// 					connect: { id: finish.deletedById }
// 				}
// 			: undefined
// 	};
// }

// static toPrismaUpdateFromDomain(finish: DomainFinish): Prisma.FinishUpdateInput {
// 	return {
// 		type: finish.type,
// 		description: finish.description,
// 		price: finish.price,
// 		originalPrice: finish.originalPrice,
// 		updatedAt: finish.updatedAt,
// 		updatedBy: {
// 			connect: { id: finish.updatedById }
// 		}
// 	};
// }
