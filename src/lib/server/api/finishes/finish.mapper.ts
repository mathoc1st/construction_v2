import type { Prisma, Finish as PrismaFinish } from '$lib/server/api/prisma/generated/client';
import { Finish as DomainFinish } from './finish.domain';
import { FinishType as DomainFinishType } from '$lib/types/finishes/finish.domain.types';
import { FinishType as PrismaFinishType } from '$lib/server/api/prisma/generated/enums';
import type { FinishDto } from '$lib/dtos/finish.dto';

export const finishTypePrismaMap: Record<PrismaFinishType, DomainFinishType> = {
	COLD: DomainFinishType.COLD,
	WARM_100: DomainFinishType.WARM_100,
	WARM_150: DomainFinishType.WARM_150,
	WARM_200: DomainFinishType.WARM_200
};

export class FinishMapper {
	static toDtoFromDomainWithId(id: number, finish: DomainFinish): FinishDto {
		return {
			id,
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice
		};
	}

	static toDomainFromPrisma(record: PrismaFinish): DomainFinish {
		return DomainFinish.fromPersistence({
			...record,
			type: finishTypePrismaMap[record.type]
		});
	}

	static toPrismaFromDomain(finish: DomainFinish): Omit<PrismaFinish, 'id' | 'buildingId'> {
		return {
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice,
			createdAt: finish.createdAt,
			updatedAt: finish.updatedAt,
			deletedAt: finish.deletedAt,
			createdById: finish.createdById,
			updatedById: finish.updatedById,
			deletedById: finish.deletedById
		};
	}

	static toPrismaCreateFromDomain(
		finish: DomainFinish
	): Omit<Prisma.FinishCreateInput, 'building'> {
		return {
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice,
			createdBy: {
				connect: { id: finish.createdById }
			},
			updatedBy: {
				connect: { id: finish.updatedById }
			},
			deletedBy: finish.deletedById
				? {
						connect: { id: finish.deletedById }
					}
				: undefined
		};
	}

	static toPrismaUpdateFromDomain(finish: DomainFinish): Prisma.FinishUpdateInput {
		return {
			type: finish.type,
			description: finish.description,
			price: finish.price,
			originalPrice: finish.originalPrice,
			updatedAt: finish.updatedAt,
			updatedBy: {
				connect: { id: finish.updatedById }
			}
		};
	}
}
