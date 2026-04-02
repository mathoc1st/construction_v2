import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	Prisma,
	type Finish as PrismaFinish,
	FinishType as PrismaFinishType
} from '$lib/server/prisma/generated/client';
import { Finish as DomainFinish } from '../../finish.domain';
import {
	FinishType as DomainFinishType,
	FinishSortableFields,
	type IFinishesRepository
} from '../../finish.types';
import { SortDirection, type DbClient } from '$lib/server/prisma/prisma.types';
import { FinishesRepository } from '../../finishes.repository';

const finishTypeMap: Record<PrismaFinishType, DomainFinishType> = {
	COLD: DomainFinishType.COLD,
	WARM_100: DomainFinishType.WARM_100,
	WARM_150: DomainFinishType.WARM_150,
	WARM_200: DomainFinishType.WARM_200
};

describe('Finish Repository Unit Tests', () => {
	const prismaMock = {
		finish: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findUnique: vi.fn(),
			findMany: vi.fn(),
			count: vi.fn()
		}
	};

	const finishRepository: IFinishesRepository = new FinishesRepository(
		prismaMock as unknown as DbClient
	);

	const record: PrismaFinish = {
		id: 1,
		type: PrismaFinishType.COLD,
		description: 'asd',
		price: 123,
		originalPrice: null,
		buildingId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		createdById: 1,
		updatedById: 1,
		deletedById: null
	};

	let newFinish: DomainFinish;
	let existingFinish: DomainFinish;
	let deletedFinish: DomainFinish;

	beforeEach(() => {
		newFinish = DomainFinish.create({
			type: finishTypeMap[record.type],
			description: record.description,
			price: record.price,
			createdById: record.createdById,
			buildingId: record.buildingId
		});

		existingFinish = DomainFinish.fromPersistence({
			...record,
			type: finishTypeMap[record.type]
		});

		deletedFinish = DomainFinish.fromPersistence({
			...record,
			type: finishTypeMap[record.type],
			deletedAt: new Date(),
			deletedById: 1
		});

		vi.clearAllMocks();
	});

	describe('Create Finish', () => {
		it('should create a new finish successfully', async () => {
			const expectedParams: Prisma.FinishCreateArgs = {
				data: {
					type: newFinish.type,
					description: newFinish.description,
					price: newFinish.price,
					originalPrice: newFinish.originalPrice,
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
					deletedAt: null,
					createdById: newFinish.createdById,
					updatedById: newFinish.updatedById,
					deletedById: null,
					buildingId: newFinish.buildingId
				}
			};

			prismaMock.finish.create.mockResolvedValueOnce(record);

			const result = await finishRepository.create(newFinish);

			expect(prismaMock.finish.create).toHaveBeenCalledExactlyOnceWith(expectedParams);
			expect(result).toEqual(existingFinish);
		});
	});

	describe('Update Finish', () => {
		it('should update finish successfully', async () => {
			const existingFinish = DomainFinish.fromPersistence({
				...record,
				type: finishTypeMap[record.type]
			});

			const updatedRecord: PrismaFinish = {
				...record,
				type: PrismaFinishType.WARM_100,
				description: 'updated',
				price: 111,
				originalPrice: 10
			};
			const updatedFinish: DomainFinish = DomainFinish.fromPersistence({
				...updatedRecord,
				type: finishTypeMap[updatedRecord.type]
			});
			const expectedParams: Prisma.FinishUpdateArgs = {
				where: {
					id: existingFinish.id!
				},
				data: toPrismaFinish(updatedFinish)
			};
			prismaMock.finish.update.mockResolvedValueOnce(updatedRecord);

			const result = await finishRepository.update(updatedFinish);

			expect(prismaMock.finish.update).toHaveBeenCalledExactlyOnceWith(expectedParams);
			expect(result).toEqual(updatedFinish);
		});

		it('should  throw an error if finish is missing an id', async () => {
			await expect(finishRepository.update(newFinish)).rejects.toThrow();
		});
	});

	describe('Delete Finish', () => {
		it('should delete finish successfully', async () => {
			const expectedParams: Prisma.FinishDeleteArgs = {
				where: {
					id: deletedFinish.id!
				}
			};

			prismaMock.finish.delete.mockResolvedValueOnce(undefined);

			await finishRepository.delete(deletedFinish);

			expect(prismaMock.finish.delete).toHaveBeenCalledExactlyOnceWith(expectedParams);
		});

		it('should  throw an error if finish is missing an id', async () => {
			await expect(finishRepository.delete(newFinish)).rejects.toThrow();
		});
	});

	describe('Find All Finishes', () => {
		it('should find all finishes with the specified query options successfully', async () => {
			const expectedParams: Prisma.FinishFindManyArgs = {
				where: {
					type: PrismaFinishType.COLD
				},
				orderBy: {
					price: 'asc'
				},
				take: 10,
				skip: 0
			};

			prismaMock.finish.findMany.mockResolvedValueOnce([record]);

			const result = await finishRepository.findAll({
				filters: {
					type: DomainFinishType.COLD
				},
				sort: {
					field: FinishSortableFields.PRICE,
					direction: SortDirection.ASC
				},
				pagination: {
					offset: 0,
					limit: 10
				}
			});

			expect(prismaMock.finish.findMany).toHaveBeenCalledExactlyOnceWith(expectedParams);
			expect(result).toEqual(expect.arrayContaining([existingFinish]));
		});
	});

	describe('Count All Found Finishes', () => {
		it('should should find all finishes with the specified query options and  return a count of them successfully', async () => {
			const expectedParams: Prisma.FinishCountArgs = {
				where: {
					type: PrismaFinishType.COLD
				}
			};

			prismaMock.finish.count.mockResolvedValueOnce(1);

			const result = await finishRepository.findAllCount({
				type: DomainFinishType.COLD
			});

			expect(prismaMock.finish.count).toHaveBeenCalledExactlyOnceWith(expectedParams);
			expect(result).toBe(1);
		});
	});

	describe('Get Finish by ID', () => {
		it('should get finish by id successfully', async () => {
			const expectedParams: Prisma.FinishFindUniqueArgs = {
				where: {
					id: existingFinish.id!
				}
			};

			prismaMock.finish.findUnique.mockResolvedValueOnce(record);

			const result = await finishRepository.getById(existingFinish.id!);

			expect(prismaMock.finish.findUnique).toHaveBeenCalledExactlyOnceWith(expectedParams);
			expect(result).toEqual(existingFinish);
		});
	});
});

function toPrismaFinish(finish: DomainFinish): Omit<PrismaFinish, 'id'> {
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
