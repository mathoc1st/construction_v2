import { beforeEach, describe, expect, it } from 'vitest';
import { Building } from '../../building.domain';
import {
	EntityAlreadyDeletedError,
	NonPositiveValueError
} from '../../../common/errors/errors.domain';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';

describe('Building Domain Unit', () => {
	let building: Building;

	beforeEach(() => {
		building = Building.fromPersistence({
			constructionType: ConstructionType.BARN,
			width: 10,
			length: 20,
			height: 5,
			bedrooms: 2,
			bathrooms: 1,
			floors: 1,
			hasVeranda: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			updatedById: 1,
			deletedById: null,
			createdById: 1
		});
	});

	describe('Building Creation', () => {
		it('should create a building with valid parameters', () => {
			const building = Building.create({
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 5,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				hasVeranda: false,
				createdById: 1
			});

			expect(building).toBeInstanceOf(Building);
			expect(building.constructionType).toBe(ConstructionType.BARN);
			expect(building.width).toBe(10);
			expect(building.length).toBe(20);
			expect(building.height).toBe(5);
			expect(building.bedrooms).toBe(2);
			expect(building.bathrooms).toBe(1);
			expect(building.floors).toBe(1);
			expect(building.hasVeranda).toBe(false);
			expect(building.createdById).toEqual(1);
			expect(building.createdAt).toBeInstanceOf(Date);
			expect(building.updatedAt).toBeInstanceOf(Date);
			expect(building.deletedAt).toBeNull();
			expect(building.updatedById).toEqual(1);
			expect(building.deletedById).toBeNull();
			expect(building.isDeleted).toBe(false);
			expect(building.hasVeranda).toBe(false);
		});

		it('should create a building from persistence', () => {
			const building = Building.fromPersistence({
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 5,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				hasVeranda: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null,
				createdById: 1
			});

			expect(building).toBeInstanceOf(Building);
			expect(building.constructionType).toBe(ConstructionType.BARN);
			expect(building.width).toBe(10);
			expect(building.length).toBe(20);
			expect(building.height).toBe(5);
			expect(building.bedrooms).toBe(2);
			expect(building.bathrooms).toBe(1);
			expect(building.floors).toBe(1);
			expect(building.hasVeranda).toBe(false);
			expect(building.createdAt).toBeInstanceOf(Date);
			expect(building.updatedAt).toBeInstanceOf(Date);
			expect(building.deletedAt).toBeNull();
			expect(building.updatedById).toEqual(1);
			expect(building.deletedById).toBeNull();
			expect(building.createdById).toEqual(1);
		});

		it('should throw an error when creating a building with invalid width', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 0,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error when creating a building with invalid length', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: -5,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error when creating a building with invalid height', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 0,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error when creating a building with invalid number of bedrooms', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: -1,
					bathrooms: 1,
					floors: 1,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error when creating a building with invalid number of bathrooms', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: -1,
					floors: 1,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error when creating a building with invalid number of floors', () => {
			expect(() =>
				Building.create({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 0,
					hasVeranda: false,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Width', () => {
		it('should change the width of the building', () => {
			building.changeWidth(15, 1);
			expect(building.width).toBe(15);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting width to zero or negative', () => {
			expect(() => building.changeWidth(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeWidth(-5, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Length', () => {
		it('should change the length of the building', () => {
			building.changeLength(25, 1);
			expect(building.length).toBe(25);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting length to zero or negative', () => {
			expect(() => building.changeLength(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeLength(-5, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Height', () => {
		it('should change the height of the building', () => {
			building.changeHeight(10, 1);
			expect(building.height).toBe(10);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting height to zero or negative', () => {
			expect(() => building.changeHeight(0, 1)).toThrow(NonPositiveValueError);
			expect(() => building.changeHeight(-5, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Bedrooms', () => {
		it('should change the number of bedrooms in the building', () => {
			building.changeBedrooms(3, 1);
			expect(building.bedrooms).toBe(3);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting bedrooms to negative', () => {
			expect(() => building.changeBedrooms(-1, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Bathrooms', () => {
		it('should change the number of bathrooms in the building', () => {
			building.changeBathrooms(2, 1);
			expect(building.bathrooms).toBe(2);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting bathrooms to negative', () => {
			expect(() => building.changeBathrooms(-1, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Floors', () => {
		it('should change the number of floors in the building', () => {
			building.changeFloors(2, 1);
			expect(building.floors).toBe(2);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting floors to negative', () => {
			expect(() => building.changeFloors(-1, 1)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Veranda', () => {
		it('should change the veranda status of the building', () => {
			building.changeVeranda(true, 1);
			expect(building.hasVeranda).toBe(true);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeWidth(15, 1)).toThrow(Error);
		});
	});

	describe('Changing Construction Type', () => {
		it('should change the construction type of the building', () => {
			building.changeConstructionType(ConstructionType.CONTAINER, 1);
			expect(building.constructionType).toBe(ConstructionType.CONTAINER);
			expect(building.updatedById).toEqual(1);
			expect(building.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when updating a deleted building', () => {
			building.markDeleted(1);
			expect(() => building.changeConstructionType(ConstructionType.FRAME, 1)).toThrow(Error);
		});
	});

	describe('Marking Deleted', () => {
		it('should mark the building as deleted', () => {
			building.markDeleted(1);
			expect(building.deletedAt).toBeInstanceOf(Date);
			expect(building.deletedById).toEqual(1);
		});

		it('should throw an error if marking deleted building twice', () => {
			building.markDeleted(1);
			expect(() => building.markDeleted(1)).toThrow(EntityAlreadyDeletedError);
		});
	});
});
