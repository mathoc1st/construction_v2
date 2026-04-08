import { beforeEach, describe, expect, it } from 'vitest';
import { Building, BuildingId } from '../../building.domain';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { UserId } from '$lib/server/api/users/user.domain';
import type {
	UpdateBuildingParams,
	UpdateFinishParams
} from '$lib/types/listings/listings.service.types';
import { FinishType } from '$lib/types/finishes/finish.domain.types';
import { Finish, FinishId } from '$lib/server/api/finishes/finish.domain';

describe('Building Domain Unit Tests', () => {
	let testBuilding: Building;
	beforeEach(() => {
		testBuilding = Building.create({
			constructionType: ConstructionType.FRAME,
			width: 15,
			length: 25,
			height: 35,
			bedrooms: 4,
			bathrooms: 3,
			floors: 3,
			hasVeranda: false,
			finishes: [],
			createdById: new UserId('user-123')
		});
	});

	describe('Building Creation', () => {
		it('should create a building with valid parameters', () => {
			const building = Building.create({
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 30,
				bedrooms: 3,
				bathrooms: 2,
				floors: 2,
				hasVeranda: true,
				finishes: [],
				createdById: new UserId('user-123')
			});

			expect(building).toBeInstanceOf(Building);
			expect(building.id).toBeInstanceOf(BuildingId);
			expect(building.constructionType).toBe(ConstructionType.BARN);
			expect(building.width).toBe(10);
			expect(building.length).toBe(20);
			expect(building.height).toBe(30);
			expect(building.bedrooms).toBe(3);
			expect(building.bathrooms).toBe(2);
			expect(building.floors).toBe(2);
			expect(building.hasVeranda).toBe(true);
			expect(building.finishes).toEqual([]);
			expect(building.createdById.value).toBe('user-123');
		});
	});

	describe('Reconcile Finishes', () => {
		it('should reconcile finishes correctly', () => {
			const finishUpdates: UpdateFinishParams[] = [
				{
					type: FinishType.COLD,
					description: 'Cold finish',
					price: 1000
				},
				{
					id: new FinishId('finish-456'),
					type: FinishType.WARM_100,
					description: 'Warm finish',
					price: 2000
				}
			];

			const building = Building.create({
				constructionType: ConstructionType.FRAME,
				width: 15,
				length: 25,
				height: 35,
				bedrooms: 4,
				bathrooms: 3,
				floors: 3,
				hasVeranda: false,
				finishes: [
					Finish.fromPersistence({
						id: new FinishId('finish-456'),
						type: FinishType.WARM_100,
						description: 'Existing warm finish',
						price: 1500,
						originalPrice: null,
						createdById: new UserId('user-123'),
						updatedById: new UserId('user-123'),
						deletedById: null,
						createdAt: new Date(),
						updatedAt: new Date(),
						deletedAt: null
					}),
					Finish.create({
						type: FinishType.WARM_150,
						description: 'Existing warm finish',
						price: 1200,
						createdById: new UserId('user-123')
					})
				],
				createdById: new UserId('user-123')
			});

			building.reconcileFinishes(finishUpdates, new UserId('user-456'));

			console.log(building.finishes);

			expect(building.finishes).toHaveLength(2);
			expect(building.finishes).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(FinishId),
						type: FinishType.COLD,
						description: 'Cold finish',
						price: 1000,
						createdById: expect.objectContaining({ value: 'user-456' }),
						updatedById: expect.objectContaining({ value: 'user-456' })
					}),
					expect.objectContaining({
						id: expect.objectContaining({ value: 'finish-456' }),
						type: FinishType.WARM_100,
						description: 'Warm finish',
						price: 2000,
						createdById: expect.objectContaining({ value: 'user-123' }),
						updatedById: expect.objectContaining({ value: 'user-456' })
					})
				])
			);
			expect(building.finishes).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.objectContaining({ value: 'finish-456' }),
						type: FinishType.WARM_150,
						description: 'Existing warm finish',
						price: 1200
					})
				])
			);
		});
	});

	describe('Change Construction Type', () => {
		it('should change construction type correctly', () => {
			const building = Building.create({
				constructionType: ConstructionType.FRAME,
				width: 15,
				length: 25,
				height: 35,
				bedrooms: 4,
				bathrooms: 3,
				floors: 3,
				hasVeranda: false,
				finishes: [],
				createdById: new UserId('user-123')
			});

			building.changeConstructionType(ConstructionType.CONTAINER, new UserId('user-456'));

			expect(building.constructionType).toBe(ConstructionType.CONTAINER);
			expect(building.updatedById.value).toBe('user-456');
		});
	});

	describe('Update Building', () => {
		it('should update building properties correctly', () => {
			const updateParams: UpdateBuildingParams = {
				constructionType: ConstructionType.BARN,
				width: 20,
				length: 30,
				height: 40,
				bedrooms: 5,
				bathrooms: 4,
				floors: 4,
				hasVeranda: true
			};

			testBuilding.update(updateParams, new UserId('user-456'));

			expect(testBuilding.constructionType).toBe(ConstructionType.BARN);
			expect(testBuilding.width).toBe(20);
			expect(testBuilding.length).toBe(30);
			expect(testBuilding.height).toBe(40);
			expect(testBuilding.bedrooms).toBe(5);
			expect(testBuilding.bathrooms).toBe(4);
			expect(testBuilding.floors).toBe(4);
			expect(testBuilding.hasVeranda).toBe(true);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});
	});

	describe('Chagen Width', () => {
		it('should change width correctly', () => {
			testBuilding.changeWidth(20, new UserId('user-456'));

			expect(testBuilding.width).toBe(20);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if width is negative', () => {
			expect(() => testBuilding.changeWidth(-5, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if width is zero', () => {
			expect(() => testBuilding.changeWidth(0, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeWidth(20, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Length', () => {
		it('should change length correctly', () => {
			testBuilding.changeLength(30, new UserId('user-456'));

			expect(testBuilding.length).toBe(30);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if length is negative', () => {
			expect(() => testBuilding.changeLength(-5, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if length is zero', () => {
			expect(() => testBuilding.changeLength(0, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeLength(30, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Height', () => {
		it('should change height correctly', () => {
			testBuilding.changeHeight(40, new UserId('user-456'));

			expect(testBuilding.height).toBe(40);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if height is negative', () => {
			expect(() => testBuilding.changeHeight(-5, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if height is zero', () => {
			expect(() => testBuilding.changeHeight(0, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeHeight(40, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Bedrooms', () => {
		it('should change bedrooms correctly', () => {
			testBuilding.changeBedrooms(5, new UserId('user-456'));

			expect(testBuilding.bedrooms).toBe(5);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if bedrooms is negative', () => {
			expect(() => testBuilding.changeBedrooms(-1, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeBedrooms(5, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Bathrooms', () => {
		it('should change bathrooms correctly', () => {
			testBuilding.changeBathrooms(4, new UserId('user-456'));

			expect(testBuilding.bathrooms).toBe(4);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if bathrooms is negative', () => {
			expect(() => testBuilding.changeBathrooms(-1, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeBathrooms(4, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Floors', () => {
		it('should change floors correctly', () => {
			testBuilding.changeFloors(4, new UserId('user-456'));

			expect(testBuilding.floors).toBe(4);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if floors is negative', () => {
			expect(() => testBuilding.changeFloors(-1, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if floors is zero', () => {
			expect(() => testBuilding.changeFloors(0, new UserId('user-456'))).toThrow();
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeFloors(4, new UserId('user-456'))).toThrow();
		});
	});

	describe('Change Veranda', () => {
		it('should change veranda correctly', () => {
			testBuilding.changeVeranda(true, new UserId('user-456'));

			expect(testBuilding.hasVeranda).toBe(true);
			expect(testBuilding.updatedById.value).toBe('user-456');
		});

		it('should throw an error if building is deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.changeVeranda(true, new UserId('user-456'))).toThrow();
		});
	});

	describe('Mark Deleted', () => {
		it('should mark building as deleted correctly', () => {
			testBuilding.markDeleted(new UserId('user-456'));

			expect(testBuilding.isDeleted).toBe(true);
			expect(testBuilding.deletedById?.value).toBe('user-456');
			expect(testBuilding.deletedAt).toBeInstanceOf(Date);
		});

		it('should throw an error if building is already deleted', () => {
			testBuilding.markDeleted(new UserId('user-456'));
			expect(() => testBuilding.markDeleted(new UserId('user-456'))).toThrow();
		});
	});
});
