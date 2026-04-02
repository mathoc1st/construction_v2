import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import {
	FinishType,
	type AddFinishParams,
	type IFinishesService,
	type IFinishesRepository,
	type UpdateFinishParams
} from '../../finish.types';
import { FinishesService } from '../../finishes.service';
import { Finish } from '../../finish.domain';
import { User } from '$lib/server/api/users/user.domain';

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

	const testUser = User.fromPersistence({
		id: 1,
		username: 'testuser',
		passwordHash: 'hashedpassword',
		createdAt: new Date(),
		updatedAt: new Date()
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Add Finish', () => {
		it('should add a new finish successfully', async () => {
			const params: AddFinishParams = {
				type: FinishType.COLD,
				description: 'Test Finish',
				price: 100,
				buildingId: 1,
				performedBy: testUser
			};

			const createdFinish: Finish = Finish.fromPersistence({
				id: 1,
				type: params.type,
				description: params.description,
				price: params.price,
				originalPrice: null,
				buildingId: params.buildingId,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: params.performedBy.id!,
				updatedById: params.performedBy.id!,
				deletedById: null
			});

			const expectedFinish: Finish = Finish.create({
				type: params.type,
				description: params.description,
				price: params.price,
				buildingId: params.buildingId,
				createdById: params.performedBy.id!
			});

			finishesRepositoryMock.create.mockResolvedValue(createdFinish);

			const result = await finishesService.addFinish(params);

			expect(finishesRepositoryMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					type: expectedFinish.type,
					description: expectedFinish.description,
					price: expectedFinish.price,
					originalPrice: expectedFinish.originalPrice,
					buildingId: expectedFinish.buildingId,
					createdById: expectedFinish.createdById,
					updatedById: expectedFinish.updatedById
				})
			);
			expect(result).toEqual(createdFinish);
		});
	});

	describe('Update Finish', () => {
		it('should update an existing finish successfully', async () => {
			const params: UpdateFinishParams = {
				targetId: 1,
				description: 'New Description',
				price: 150,
				performedById: 2
			};

			const existingFinish = Finish.fromPersistence({
				id: 1,
				type: FinishType.COLD,
				description: 'Old Description',
				price: 100,
				originalPrice: null,
				buildingId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: 1,
				updatedById: 1,
				deletedById: null
			});

			const updatedFinish = Finish.fromPersistence({
				id: 1,
				type: existingFinish.type,
				description: params.description!,
				price: params.price!,
				originalPrice: existingFinish.originalPrice,
				buildingId: existingFinish.buildingId,
				createdAt: existingFinish.createdAt,
				updatedAt: expect.any(Date),
				deletedAt: existingFinish.deletedAt,
				createdById: existingFinish.createdById,
				updatedById: params.performedById,
				deletedById: existingFinish.deletedById
			});

			finishesRepositoryMock.getById.mockResolvedValue(existingFinish);
			finishesRepositoryMock.update.mockResolvedValue(updatedFinish);

			const result = await finishesService.updateFinish(params);

			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(updatedFinish);
			expect(result).toEqual(updatedFinish);
		});
	});

	describe('Delete Finish', () => {
		it('should delete an existing finish successfully', async () => {
			const params = {
				targetId: 1,
				performedById: 2
			};

			const existingFinish = Finish.fromPersistence({
				id: 1,
				type: FinishType.COLD,
				description: 'Test Finish',
				price: 100,
				originalPrice: null,
				buildingId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: 1,
				updatedById: 1,
				deletedById: null
			});

			const deletedFinish = Finish.fromPersistence({
				id: 1,
				type: existingFinish.type,
				description: existingFinish.description,
				price: existingFinish.price,
				originalPrice: existingFinish.originalPrice,
				buildingId: existingFinish.buildingId,
				createdAt: existingFinish.createdAt,
				updatedAt: existingFinish.updatedAt,
				deletedAt: expect.any(Date),
				createdById: existingFinish.createdById,
				updatedById: existingFinish.updatedById,
				deletedById: params.performedById
			});

			finishesRepositoryMock.getById.mockResolvedValue(existingFinish);
			finishesRepositoryMock.update.mockResolvedValue(deletedFinish);

			await finishesService.deleteFinish(params);

			expect(finishesRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(finishesRepositoryMock.update).toHaveBeenCalledWith(deletedFinish);
		});
	});
});
