import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type Finish as PrismaFinish,
	FinishType as PrismaFinishType
} from '$lib/server/api/prisma/generated/client';
import { Finish as DomainFinish } from '../../finish.domain';
import {
	FinishSortableFields,
	type IFinishesRepository
} from '$lib/types/finishes/finishes.repository.types';
import { FinishType as DomainFinishType } from '$lib/types/finishes/finish.domain.types';
import { SortDirection, type DbClient } from '$lib/types/prisma/prisma.service.types';
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

	beforeEach(() => {
		newFinish = DomainFinish.create({
			type: finishTypeMap[record.type],
			description: record.description,
			price: record.price,
			createdById: record.createdById
		});

		vi.clearAllMocks();
	});

	describe('Create Finish', () => {
		it('should create a new finish successfully', async () => {
			prismaMock.finish.create.mockResolvedValueOnce(record);

			const result = await finishRepository.create(1, newFinish);

			expect(prismaMock.finish.create).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					data: expect.objectContaining({
						type: record.type,
						description: record.description,
						price: record.price,
						originalPrice: record.originalPrice
					})
				})
			);

			expect(result).toEqual({
				id: record.id,
				finish: expect.objectContaining({
					type: newFinish.type,
					description: newFinish.description,
					price: newFinish.price,
					originalPrice: newFinish.originalPrice,
					createdById: newFinish.createdById
				})
			});
		});
	});

	describe('Update Finish', () => {
		it('should update finish successfully', async () => {
			const updatedRecord: PrismaFinish = {
				...record,
				type: PrismaFinishType.WARM_100,
				description: 'updated',
				price: 111,
				originalPrice: 10
			};

			const updatedFinish = DomainFinish.fromPersistence({
				...updatedRecord,
				type: finishTypeMap[updatedRecord.type]
			});

			prismaMock.finish.update.mockResolvedValueOnce(updatedRecord);

			const result = await finishRepository.update(1, updatedFinish);

			expect(prismaMock.finish.update).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						id: 1
					},
					data: expect.objectContaining({
						type: updatedRecord.type,
						description: updatedRecord.description,
						price: updatedRecord.price,
						originalPrice: updatedRecord.originalPrice
					})
				})
			);
			expect(result).toEqual({
				id: updatedRecord.id,
				finish: expect.objectContaining({
					type: updatedFinish.type,
					description: updatedFinish.description,
					price: updatedFinish.price,
					originalPrice: updatedFinish.originalPrice,
					createdById: updatedFinish.createdById
				})
			});
		});
	});

	describe('Delete Finish', () => {
		it('should delete finish successfully', async () => {
			prismaMock.finish.delete.mockResolvedValueOnce(undefined);

			await finishRepository.delete(1);

			expect(prismaMock.finish.delete).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						id: 1
					}
				})
			);
		});
	});

	describe('Find All Finishes', () => {
		it('should find all finishes with the specified query options successfully', async () => {
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

			expect(prismaMock.finish.findMany).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						type: PrismaFinishType.COLD
					},
					orderBy: {
						price: 'asc'
					},
					take: 10,
					skip: 0
				})
			);
			expect(result).toEqual(
				expect.arrayContaining([
					{
						id: record.id,
						finish: expect.objectContaining({
							type: newFinish.type,
							description: newFinish.description,
							price: newFinish.price,
							originalPrice: newFinish.originalPrice,
							createdById: newFinish.createdById
						})
					}
				])
			);
		});
	});

	describe('Count All Found Finishes', () => {
		it('should should find all finishes with the specified query options and  return a count of them successfully', async () => {
			prismaMock.finish.count.mockResolvedValueOnce(1);

			const result = await finishRepository.findAllCount({
				type: DomainFinishType.COLD
			});

			expect(prismaMock.finish.count).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						type: PrismaFinishType.COLD
					}
				})
			);
			expect(result).toBe(1);
		});
	});

	describe('Get Finish by ID', () => {
		it('should get finish by id successfully', async () => {
			prismaMock.finish.findUnique.mockResolvedValueOnce(record);

			const result = await finishRepository.getById(1);

			expect(prismaMock.finish.findUnique).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						id: 1
					}
				})
			);
			expect(result).toEqual({
				id: record.id,
				finish: expect.objectContaining({
					type: newFinish.type,
					description: newFinish.description,
					price: newFinish.price,
					originalPrice: newFinish.originalPrice,
					createdById: newFinish.createdById
				})
			});
		});
	});
});
