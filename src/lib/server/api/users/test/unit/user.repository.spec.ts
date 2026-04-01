import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRepository } from '../../users.repository';
import { User } from '../../user.domain';
import type { IPrismaService } from '$lib/server/prisma/prisma.types';

describe('User Repository Unit', () => {
	const prismaMock = {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn()
		}
	};

	const prismaServiceMock = {
		client: prismaMock
	} as unknown as IPrismaService;

	const userService = new UserRepository(prismaServiceMock);

	let user: User;

	beforeEach(() => {
		user = User.fromPersistence({
			id: 1,
			username: 'test',
			passwordHash: 'hash',
			createdAt: new Date(),
			updatedAt: new Date()
		});
	});

	describe('Create User', () => {
		it('should create a user successfully', async () => {
			vi.mocked(prismaServiceMock.client.user.create).mockResolvedValue({
				id: 1,
				username: user.username,
				passwordHash: user.passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const newUser = await userService.create(user);

			expect(newUser).toBeInstanceOf(User);
			expect(newUser.id).toBe(user.id);
			expect(newUser.username).toBe(user.username);
			expect(newUser.passwordHash).toBe(user.passwordHash);
		});
	});

	describe('Update User', () => {
		it('should update a user successfully', async () => {
			vi.mocked(prismaServiceMock.client.user.update).mockResolvedValue({
				id: 1,
				username: user.username,
				passwordHash: user.passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const updatedUser = await userService.create(user);

			expect(updatedUser).toBeInstanceOf(User);
			expect(updatedUser.id).toBe(user.id);
			expect(updatedUser.username).toBe(user.username);
			expect(updatedUser.passwordHash).toBe(user.passwordHash);
		});
	});

	describe('Delete User', () => {
		it('should delete a user successfully', async () => {
			await userService.delete(user);

			expect(prismaServiceMock.client.user.delete).toHaveBeenCalledExactlyOnceWith({
				where: {
					id: 1
				}
			});
		});
	});
});
