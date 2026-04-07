import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRepository } from '../../users.repository';
import { User } from '../../user.domain';
import type { DbClient } from '$lib/types/prisma/prisma.service.types';

describe('User Repository Unit', () => {
	const prismaMock = {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn()
		}
	};
	const userService = new UserRepository(prismaMock as unknown as DbClient);

	let user: User;

	beforeEach(() => {
		user = User.fromPersistence({
			username: 'test',
			passwordHash: 'hash',
			createdAt: new Date(),
			updatedAt: new Date()
		});
	});

	describe('Create User', () => {
		it('should create a user successfully', async () => {
			vi.mocked(prismaMock.user.create).mockResolvedValue({
				id: 1,
				username: user.username,
				passwordHash: user.passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const result = await userService.create(user);

			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: user.username,
					passwordHash: user.passwordHash
				})
			});
		});
	});

	describe('Update User', () => {
		it('should update a user successfully', async () => {
			vi.mocked(prismaMock.user.update).mockResolvedValue({
				id: 1,
				username: user.username,
				passwordHash: user.passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const result = await userService.update(1, user);

			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: user.username,
					passwordHash: user.passwordHash
				})
			});
		});
	});

	describe('Delete User', () => {
		it('should delete a user successfully', async () => {
			await userService.delete(1);

			expect(prismaMock.user.delete).toHaveBeenCalledExactlyOnceWith({
				where: {
					id: 1
				}
			});
		});
	});
});
