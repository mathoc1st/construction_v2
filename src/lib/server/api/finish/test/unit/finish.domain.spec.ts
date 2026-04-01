import { describe, expect, it } from 'vitest';
import { Finish, FinishType } from '../../finish.domain';
import {
	EmptyStringError,
	NonPositiveValueError
} from '$lib/server/api/common/errors/errors.domain';

describe('Finish Domain Unit', () => {
	describe('Creating Finish', () => {
		it('should create a finish with valid parameters', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			expect(finish.id).toBeNull();
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
				id: 1,
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				originalPrice: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				createdById: 1,
				updatedById: 1,
				buildingId: 1
			});

			expect(finish.id).toBe(1);
			expect(finish.type).toBe(FinishType.COLD);
			expect(finish.description).toBe('Cold finish');
			expect(finish.price).toBe(1000);
			expect(finish.originalPrice).toBeNull();
			expect(finish.createdAt).toBeInstanceOf(Date);
			expect(finish.updatedAt).toBeInstanceOf(Date);
			expect(finish.createdById).toBe(1);
			expect(finish.updatedById).toBe(1);
		});
	});

	describe('Changing Finish  Type', () => {
		it('should change the finish type', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			finish.changeType(FinishType.WARM_100, 2);

			expect(finish.type).toBe(FinishType.WARM_100);
			expect(finish.updatedById).toBe(2);
		});
	});

	describe('Changing Finish Description', () => {
		it('should change the finish description', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			finish.changeDescription('Updated description', 2);

			expect(finish.description).toBe('Updated description');
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if description is empty', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			expect(() => finish.changeDescription('', 2)).toThrow(EmptyStringError);
		});
	});

	describe('Changing Finish Price', () => {
		it('should change the finish price', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			finish.changePrice(1200, 2);

			expect(finish.price).toBe(1200);
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if price is negative', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			expect(() => finish.changePrice(-100, 2)).toThrow(NonPositiveValueError);
		});
	});

	describe('Changing Finish Original Price', () => {
		it('should change the finish original price', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			finish.changeOriginalPrice(1500, 2);

			expect(finish.originalPrice).toBe(1500);
			expect(finish.updatedById).toBe(2);
		});

		it('should throw an error if original price is negative', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'Cold finish',
				price: 1000,
				createdById: 1
			});

			expect(() => finish.changeOriginalPrice(-100, 2)).toThrow(NonPositiveValueError);
		});
	});
});
