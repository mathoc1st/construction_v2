import { beforeEach, describe, expect, it } from 'vitest';
import { Building, ConstructionType, OutsideFinish } from '../../building.domain';
import { User } from '../../../users/user.domain';
import { NonPositiveValueError } from '../../../common/errors/errors.domain';

describe('Building Domain Unit', () => {
	let building: Building;

	beforeEach(() => {
		building = Building.fromPersistence({
			id: 1,
			constructionType: ConstructionType.BARN,
			outsideFinishes: new Set([OutsideFinish.COLD]),
			width: 10,
			length: 20,
			height: 5,
			bedrooms: 2,
			bathrooms: 1,
			floors: 1,
			veranda: false,
			createdAt: new Date(),
			updatedAt: null,
			deletedAt: null,
			updatedByUserId: null,
			deletedByUserId: null,
			createdByUserId: 1
		});
	});

	describe('Building Creation', () => {
		it('should create a building with valid parameters', () => {
			const building = Building.create({
				constructionType: ConstructionType.BARN,
				outsideFinishes: new Set([OutsideFinish.COLD]),
				width: 10,
				length: 20,
				height: 5,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				veranda: false,
				createdByUserId: 1
			});

			expect(building).toBeInstanceOf(Building);
			expect(building.constructionType).toBe(ConstructionType.BARN);
			expect(building.outsideFinishes.has(OutsideFinish.COLD)).toBe(true);
			expect(building.width).toBe(10);
			expect(building.length).toBe(20);
			expect(building.height).toBe(5);
			expect(building.bedrooms).toBe(2);
			expect(building.bathrooms).toBe(1);
			expect(building.floors).toBe(1);
			expect(building.hasVeranda).toBe(false);
			expect(building.createdByUserId).toEqual(1);
		});

		it('should create a building from persistence', () => {
			const building = Building.fromPersistence({
				id: 1,
				constructionType: ConstructionType.BARN,
				outsideFinishes: new Set([OutsideFinish.COLD]),
				width: 10,
				length: 20,
				height: 5,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				veranda: false,
				createdAt: new Date(),
				updatedAt: null,
				deletedAt: null,
				updatedByUserId: null,
				deletedByUserId: null,
				createdByUserId: 1
			});

			expect(building).toBeInstanceOf(Building);
			expect(building.id).toBe(1);
			expect(building.constructionType).toBe(ConstructionType.BARN);
			expect(building.outsideFinishes.has(OutsideFinish.COLD)).toBe(true);
			expect(building.width).toBe(10);
			expect(building.length).toBe(20);
			expect(building.height).toBe(5);
			expect(building.bedrooms).toBe(2);
			expect(building.bathrooms).toBe(1);
			expect(building.floors).toBe(1);
			expect(building.hasVeranda).toBe(false);
			expect(building.createdAt).toBeInstanceOf(Date);
			expect(building.updatedAt).toBeNull();
			expect(building.deletedAt).toBeNull();
			expect(building.updatedByUserId).toBeNull();
			expect(building.deletedByUserId).toBeNull();
			expect(building.createdByUserId).toEqual(1);
		});
	});

	describe('Changing Width', () => {
		it('should change the width of the building', () => {
			building.changeWidth(15, 1);
			expect(building.width).toBe(15);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting width to zero or negative', () => {
			expect(() => building.changeWidth(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeWidth(-5, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Length', () => {
		it('should change the length of the building', () => {
			building.changeLength(25, 1);
			expect(building.length).toBe(25);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting length to zero or negative', () => {
			expect(() => building.changeLength(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeLength(-5, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Height', () => {
		it('should change the height of the building', () => {
			building.changeHeight(10, 1);
			expect(building.height).toBe(10);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting height to zero or negative', () => {
			expect(() => building.changeHeight(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeHeight(-5, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Bedrooms', () => {
		it('should change the number of bedrooms in the building', () => {
			building.changeBedrooms(3, 1);
			expect(building.bedrooms).toBe(3);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting bedrooms to negative', () => {
			expect(() => building.changeBedrooms(-1, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Bathrooms', () => {
		it('should change the number of bathrooms in the building', () => {
			building.changeBathrooms(2, 1);
			expect(building.bathrooms).toBe(2);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting bathrooms to negative', () => {
			expect(() => building.changeBathrooms(-1, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Floors', () => {
		it('should change the number of floors in the building', () => {
			building.changeFloors(2, 1);
			expect(building.floors).toBe(2);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting floors to negative', () => {
			expect(() => building.changeFloors(-1, 1)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Veranda', () => {
		it('should change the veranda status of the building', () => {
			building.changeVeranda(true, 1);
			expect(building.hasVeranda).toBe(true);
			expect(building.updatedByUserId).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});
	});

	describe('Marking Deleted', () => {
		it('should mark the building as deleted', () => {
			building.markDeleted(1);
			expect(building.deletedAt).toBeInstanceOf(Date);
			expect(building.deletedByUserId).toEqual(1);
		});
	});
});
