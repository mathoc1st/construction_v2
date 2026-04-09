import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Finish, FinishId } from '../../finish.domain';
import { FinishType } from '$lib/types/finishes/finish.domain.types';
import { UserId } from '$lib/server/api/users/user.domain';

describe('Finish Domain Unit Tests', () => {
	let testFinish: Finish;

	beforeEach(() => {
		testFinish = Finish.create({
			type: FinishType.COLD,
			description: 'test',
			price: 100,
			originalPrice: null,
			createdById: new UserId('user-1')
		});
	});

	describe('Finish Creation', () => {
		it('should create a Finish with valid properties', () => {
			const finish = Finish.create({
				type: FinishType.COLD,
				description: 'test finish',
				price: 150,
				originalPrice: 200,
				createdById: new UserId('user-2')
			});

			expect(finish).toBeInstanceOf(Finish);
			expect(finish.id).toBeInstanceOf(FinishId);
			expect(finish.type).toBe(FinishType.COLD);
			expect(finish.description).toBe('test finish');
			expect(finish.price).toBe(150);
			expect(finish.originalPrice).toBe(200);
			expect(finish.createdById.value).toBe('user-2');
		});

		it('should create a Finish with valid properties from persistence', () => {
			const finish = Finish.fromPersistence({
				id: new FinishId('finish-1'),
				type: FinishType.WARM_100,
				description: 'persisted finish',
				price: 120,
				originalPrice: null,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				updatedAt: new Date('2024-01-02T00:00:00Z'),
				deletedAt: null,
				createdById: new UserId('user-3'),
				updatedById: new UserId('user-3'),
				deletedById: null
			});

			expect(finish).toBeInstanceOf(Finish);
			expect(finish.id.value).toBe('finish-1');
			expect(finish.type).toBe(FinishType.WARM_100);
			expect(finish.description).toBe('persisted finish');
			expect(finish.price).toBe(120);
			expect(finish.originalPrice).toBeNull();
			expect(finish.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
			expect(finish.updatedAt.toISOString()).toBe('2024-01-02T00:00:00.000Z');
			expect(finish.deletedAt).toBeNull();
			expect(finish.createdById.value).toBe('user-3');
			expect(finish.updatedById.value).toBe('user-3');
			expect(finish.deletedById).toBeNull();
		});
	});

	describe('Change Finish Type', () => {
		it('should change the finish type correctly', () => {
			testFinish.changeType(FinishType.WARM_150, new UserId('user-4'));
			expect(testFinish.type).toBe(FinishType.WARM_150);
		});

		it('should throw an error finish is deleted', () => {
			testFinish.markDeleted(new UserId('user-5'));
			expect(() => testFinish.changeType(FinishType.WARM_150, new UserId('user-4'))).toThrow();
		});
	});

	describe('Change Finish Description', () => {
		it('should change the finish description correctly', () => {
			testFinish.changeDescription('updated description', new UserId('user-4'));
			expect(testFinish.description).toBe('updated description');
		});

		it('should throw an error if description is empty', () => {
			expect(() => testFinish.changeDescription('', new UserId('user-4'))).toThrow();
		});

		it('should throw an error finish is deleted', () => {
			testFinish.markDeleted(new UserId('user-5'));
			expect(() =>
				testFinish.changeDescription('updated description', new UserId('user-4'))
			).toThrow();
		});
	});

	describe('Change Finish Price', () => {
		it('should change the finish price correctly', () => {
			testFinish.changePrice(200, new UserId('user-4'));
			expect(testFinish.price).toBe(200);
		});

		it('should throw an error finish is deleted', () => {
			testFinish.markDeleted(new UserId('user-5'));
			expect(() => testFinish.changePrice(200, new UserId('user-4'))).toThrow();
		});
	});
});
