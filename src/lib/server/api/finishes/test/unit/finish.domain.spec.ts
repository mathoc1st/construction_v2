import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Finish } from '../../finish.domain';
import {
	DeletedEntityModificationError,
	EmptyStringError,
	NonPositiveValueError
} from '$lib/server/api/common/errors/errors.domain';
import { FinishType } from '$lib/types/finishes/finish.domain.types';

describe('Finish Domain Unit', () => {
	let finish: Finish;
	let deletedFinish: Finish;

	beforeEach(() => {
		finish = Finish.fromPersistence({
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

		deletedFinish = Finish.fromPersistence({
			type: FinishType.COLD,
			description: 'test',
			price: 100,
			originalPrice: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			createdById: 1,
			updatedById: 1,
			deletedById: 1
		});

		vi.clearAllMocks();
	});
	describe('Creating Finish', () => {
		it('should create a finish with valid parameters', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			expect(finish.type).toBe(FinishType.COLD);
			expect(finish.description).toBe('Cold finish');
			expect(finish.price).toBe(1000);
			expect(finish.originalPrice).toBeNull();
			expect(finish.createdAt).toBeInstanceOf(Date);
			expect(finish.updatedAt).toBeInstanceOf(Date);
			expect(finish.createdById).toBe(1);
			expect(finish.updatedById).toBe(1);
		});

		it('should create a finish from persistence with valid parameters', () => {
			const finish = Finish.fromPersistence({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				originalPrice: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: 1,
				updatedById: 1,
				deletedById: null
			});

			expect(finish.type).toBe(FinishType.COLD);
			expect(finish.description).toBe('Cold finish');
			expect(finish.price).toBe(1000);
			expect(finish.originalPrice).toBeNull();
			expect(finish.createdAt).toBeInstanceOf(Date);
			expect(finish.updatedAt).toBeInstanceOf(Date);
			expect(finish.deletedAt).toBeNull();
			expect(finish.createdById).toBe(1);
			expect(finish.updatedById).toBe(1);
			expect(finish.deletedById).toBeNull();
		});

		it('should throw an error if description is empty', () => {
			expect(() =>
				Finish.create({
					type: FinishType.COLD,
					description: '',
					price: 1000,
					createdById: 1
				})
			).toThrow(EmptyStringError);
		});

		it('should throw an error if price is negative', () => {
			expect(() =>
				Finish.create({
					type: FinishType.COLD,
					description: 'Cold finish',
					price: -100,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});

		it('should throw an error if original price is negative', () => {
			expect(() =>
				Finish.create({
					type: FinishType.COLD,
					description: 'Cold finish',
					price: 1000,
					originalPrice: -100,
					createdById: 1
				})
			).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Finish  Type', () => {
		it('should change the finish type', () => {
			finish.changeType(FinishType.WARM_100, 2);

			expect(finish.type).toBe(FinishType.WARM_100);
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error when updating a deleted finish', () => {
			expect(() => deletedFinish.changeType(FinishType.WARM_100, 2)).toThrow(
				DeletedEntityModificationError
			);
		});
	});

	describe('Changing Finish Description', () => {
		it('should change the finish description', () => {
			finish.changeDescription('Updated description', 2);

			expect(finish.description).toBe('Updated description');
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if description is empty', () => {
			expect(() => finish.changeDescription('', 2)).toThrow(EmptyStringError);
		});

		it('should throw an error when updating a deleted finish', () => {
			expect(() => deletedFinish.changeDescription('Updated description', 2)).toThrow(
				DeletedEntityModificationError
			);
		});
	});

	describe('Changing Finish Price', () => {
		it('should change the finish price', () => {
			finish.changePrice(1200, 2);

			expect(finish.price).toBe(1200);
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if price is negative', () => {
			expect(() => finish.changePrice(-100, 2)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted finish', () => {
			expect(() => deletedFinish.changePrice(1200, 2)).toThrow(DeletedEntityModificationError);
		});
	});

	describe('Changing Finish Original Price', () => {
		it('should change the finish original price', () => {
			finish.changeOriginalPrice(1500, 2);

			expect(finish.originalPrice).toBe(1500);
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if original price is negative', () => {
			expect(() => finish.changeOriginalPrice(-100, 2)).toThrow(NonPositiveValueError);
		});

		it('should throw an error when updating a deleted finish', () => {
			expect(() => deletedFinish.changeOriginalPrice(1500, 2)).toThrow(
				DeletedEntityModificationError
			);
		});
	});
});
