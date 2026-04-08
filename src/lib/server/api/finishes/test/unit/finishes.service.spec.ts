import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import {
	type AddFinishParams,
	type IFinishesService,
	type ReconcileFinishParams,
	type UpdateFinishParams
} from '$lib/types/finishes/finishes.service.types';
import { FinishesService } from '../../finishes.service';
import { Finish } from '../../finish.domain';
import type { IFinishesRepository } from '$lib/types/finishes/finishes.repository.types';
import { FinishType } from '$lib/types/finishes/finish.domain.types';

describe('Finishes Service Unit Tests', () => {
	const finishesRepositoryMock: Mocked<IFinishesRepository> = {
		create: vi.fn(),
		getById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		findAll: vi.fn(),
		findAllCount: vi.fn(),
		withClient: vi.fn()
	};

	const finishesService: IFinishesService = new FinishesService(finishesRepositoryMock);

	let existingFinish: Finish;

	beforeEach(() => {
		existingFinish = Finish.fromPersistence({
			type: FinishType.COLD,
			description: 'test',
			price: 100,
			originalPrice: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			createdById: 1,
			updatedById: 1,
			deletedById: null
		});

		vi.clearAllMocks();
	});

	describe('Add Finish', () => {
		it('should add a new finish successfully', async () => {
			const params: AddFinishParams = {
				type: FinishType.COLD,
				description: 'Test Finish',
				price: 100,
				buildingId: 1,
				performedById: 1
			};

			const createdFinish: Finish = Finish.fromPersistence({
				type: params.type,
				description: params.description,
				price: params.price,
				originalPrice: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: params.performedById,
				updatedById: params.performedById,
				deletedById: null
			});

			finishesRepositoryMock.create.mockResolvedValue({
				id: 1,
				finish: createdFinish
			});

			const result = await finishesService.addFinish(params);

			expect(finishesRepositoryMock.create).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					type: createdFinish.type,
					description: createdFinish.description,
					price: createdFinish.price,
					originalPrice: createdFinish.originalPrice,
					createdById: createdFinish.createdById
				})
			);
			expect(result).toEqual({
				id: 1,
				finish: expect.objectContaining({
					type: createdFinish.type,
					description: createdFinish.description,
					price: createdFinish.price,
					originalPrice: createdFinish.originalPrice,
					createdById: createdFinish.createdById
				})
			});
		});
	});

	describe('Reconcile Finishes', () => {
		it('should delete finishes that no longer exist in the provided list', async () => {
			const toDeleteId = 2;
			const toDeletedFinish = Finish.fromPersistence({
				type: FinishType.COLD,
				description: 'Finish 1',
				price: 100,
				originalPrice: null,
				createdById: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null
			});

			const params: ReconcileFinishParams = {
				performedById: 1,
				buildingId: 1,
				finishes: []
			};

			const existingFinishes = [
				{
					id: toDeleteId,
					finish: toDeletedFinish
				}
			];

			finishesRepositoryMock.findAll.mockResolvedValue(existingFinishes);
			finishesRepositoryMock.getById.mockResolvedValueOnce({
				id: toDeleteId,
				finish: toDeletedFinish
			});
			finishesRepositoryMock.update.mockResolvedValueOnce({
				id: toDeleteId,
				finish: Finish.fromPersistence({
					type: toDeletedFinish.type,
					description: toDeletedFinish.description,
					price: toDeletedFinish.price,
					originalPrice: toDeletedFinish.originalPrice,
					createdAt: toDeletedFinish.createdAt,
					updatedAt: new Date(),
					deletedAt: new Date(),
					createdById: toDeletedFinish.createdById,
					updatedById: toDeletedFinish.updatedById,
					deletedById: params.performedById
				})
			});

			const result = await finishesService.reconcileFinishes(params);

			expect(finishesRepositoryMock.findAll).toHaveBeenCalledWith({
				filters: {
					buildingId: params.buildingId
				}
			});
			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(toDeleteId);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(
				toDeleteId,
				expect.objectContaining({
					type: toDeletedFinish.type,
					description: toDeletedFinish.description,
					price: toDeletedFinish.price,
					originalPrice: toDeletedFinish.originalPrice,
					createdById: toDeletedFinish.createdById,
					deletedAt: expect.any(Date),
					deletedById: params.performedById
				})
			);
			expect(result).toEqual([]);
		});
		it('should add new finishes that are in the provided list but not in the database', async () => {
			const params: ReconcileFinishParams = {
				performedById: 1,
				buildingId: 1,
				finishes: [
					{
						targetId: 2,
						type: FinishType.COLD,
						description: 'New Finish',
						price: 100,
						originalPrice: null
					}
				]
			};

			finishesRepositoryMock.findAll.mockResolvedValue([]);
			finishesRepositoryMock.create.mockResolvedValue({
				id: 2,
				finish: Finish.fromPersistence({
					type: params.finishes[0].type,
					description: params.finishes[0].description!,
					price: params.finishes[0].price!,
					originalPrice: params.finishes[0].originalPrice!,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
					createdById: params.performedById,
					updatedById: params.performedById,
					deletedById: null
				})
			});

			const result = await finishesService.reconcileFinishes(params);

			expect(finishesRepositoryMock.findAll).toHaveBeenCalledWith({
				filters: {
					buildingId: params.buildingId
				}
			});
			expect(finishesRepositoryMock.create).toHaveBeenCalledWith(
				params.buildingId,
				expect.objectContaining({
					type: params.finishes[0].type,
					description: params.finishes[0].description,
					price: params.finishes[0].price,
					originalPrice: params.finishes[0].originalPrice,
					createdById: params.performedById
				})
			);
			expect(result).toEqual([
				{
					id: 2,
					finish: expect.objectContaining({
						type: params.finishes[0].type,
						description: params.finishes[0].description,
						price: params.finishes[0].price,
						originalPrice: params.finishes[0].originalPrice,
						createdById: params.performedById
					})
				}
			]);
		});
		it('should update existing finishes that are in both the provided list and the database', async () => {
			const params: ReconcileFinishParams = {
				performedById: 1,
				buildingId: 1,
				finishes: [
					{
						targetId: 1,
						type: FinishType.COLD,
						description: 'Updated Finish',
						price: 150,
						originalPrice: null
					}
				]
			};

			const existingFinishes = [
				{
					id: 1,
					finish: Finish.fromPersistence({
						type: FinishType.COLD,
						description: 'Existing Finish',
						price: 100,
						originalPrice: null,
						createdAt: new Date(),
						updatedAt: new Date(),
						deletedAt: null,
						createdById: 1,
						updatedById: 1,
						deletedById: null
					})
				}
			];

			finishesRepositoryMock.findAll.mockResolvedValue(existingFinishes);
			finishesRepositoryMock.getById.mockResolvedValue({
				id: 1,
				finish: existingFinishes[0].finish
			});
			finishesRepositoryMock.update.mockResolvedValue({
				id: 1,
				finish: Finish.fromPersistence({
					type: params.finishes[0].type,
					description: params.finishes[0].description!,
					price: params.finishes[0].price!,
					originalPrice: params.finishes[0].originalPrice!,
					createdAt: existingFinishes[0].finish.createdAt,
					updatedAt: new Date(),
					deletedAt: null,
					createdById: existingFinishes[0].finish.createdById,
					updatedById: params.performedById,
					deletedById: null
				})
			});

			const result = await finishesService.reconcileFinishes(params);

			expect(finishesRepositoryMock.findAll).toHaveBeenCalledWith({
				filters: {
					buildingId: params.buildingId
				}
			});
			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(1);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					type: params.finishes[0].type,
					description: params.finishes[0].description,
					price: params.finishes[0].price,
					originalPrice: params.finishes[0].originalPrice,
					createdById: existingFinishes[0].finish.createdById,
					updatedById: params.performedById
				})
			);
			expect(result).toEqual([
				{
					id: 1,
					finish: expect.objectContaining({
						type: params.finishes[0].type,
						description: params.finishes[0].description,
						price: params.finishes[0].price,
						originalPrice: params.finishes[0].originalPrice,
						createdById: existingFinishes[0].finish.createdById,
						updatedById: params.performedById
					})
				}
			]);
		});
	});

	describe('Update Finish', () => {
		it('should update an existing finish successfully', async () => {
			const params: UpdateFinishParams = {
				type: FinishType.COLD,
				id: 1,
				description: 'New Description',
				price: 150,
				performedById: 2
			};

			const updatedFinish = Finish.fromPersistence({
				type: existingFinish.type,
				description: params.description!,
				price: params.price!,
				originalPrice: existingFinish.originalPrice,
				createdAt: existingFinish.createdAt,
				updatedAt: existingFinish.updatedAt,
				deletedAt: existingFinish.deletedAt,
				createdById: existingFinish.createdById,
				updatedById: params.performedById,
				deletedById: existingFinish.deletedById
			});

			finishesRepositoryMock.getById.mockResolvedValue({
				id: params.id,
				finish: existingFinish
			});
			finishesRepositoryMock.update.mockResolvedValue({
				id: params.id,
				finish: updatedFinish
			});

			const result = await finishesService.updateFinish(params);

			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(params.id);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					type: updatedFinish.type,
					description: updatedFinish.description,
					price: updatedFinish.price,
					originalPrice: updatedFinish.originalPrice,
					createdById: updatedFinish.createdById
				})
			);

			expect(result).toEqual({
				id: params.id,
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
		it('should delete an existing finish successfully', async () => {
			const params = {
				targetId: 1,
				performedById: 2
			};

			finishesRepositoryMock.getById.mockResolvedValue({
				id: params.targetId,
				finish: existingFinish
			});

			await finishesService.deleteFinish(params);

			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(finishesRepositoryMock.delete).toHaveBeenCalledWith(params.targetId);
		});
	});

	describe('Soft Delete Finish', () => {
		it('should soft delete an existing finish successfully', async () => {
			const params = {
				targetId: 1,
				performedById: 2
			};

			const deletedFinish = Finish.fromPersistence({
				type: existingFinish.type,
				description: existingFinish.description,
				price: existingFinish.price,
				originalPrice: existingFinish.originalPrice,
				createdAt: existingFinish.createdAt,
				updatedAt: existingFinish.updatedAt,
				deletedAt: expect.any(Date),
				createdById: existingFinish.createdById,
				updatedById: existingFinish.updatedById,
				deletedById: params.performedById
			});

			finishesRepositoryMock.getById.mockResolvedValue({
				id: params.targetId,
				finish: existingFinish
			});
			finishesRepositoryMock.update.mockResolvedValue({
				id: 1,
				finish: deletedFinish
			});

			const result = await finishesService.softDeleteFinish(params);

			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(1, deletedFinish);
			expect(result).toEqual({
				id: 1,
				finish: expect.objectContaining({
					type: deletedFinish.type,
					description: deletedFinish.description,
					price: deletedFinish.price,
					originalPrice: deletedFinish.originalPrice,
					createdById: deletedFinish.createdById,
					deletedAt: expect.any(Date),
					deletedById: deletedFinish.deletedById
				})
			});
		});
	});
});
