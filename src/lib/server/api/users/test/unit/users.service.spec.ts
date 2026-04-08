import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import type { IUsersRepository } from '$lib/types/users/users.repository.types';
import type { IPasswordService } from '$lib/server/api/auth/auth.type';
import { UsersService } from '../../users.service';
import { User } from '../../user.domain';
import { EntityNotFoundError } from '$lib/server/api/common/errors/errors.service';
import type { AddUserParams, UpdateUserParams } from '$lib/types/users/users.service.types';

describe('Users Service Unit Tests', () => {
	const usersRepositoryMock: Mocked<IUsersRepository> = {
		withClient: vi.fn().mockReturnThis(),
		create: vi.fn(),
		getById: vi.fn(),
		getByUsername: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	};

	const passwordServiceMock: Mocked<IPasswordService> = {
		hashPassword: vi.fn().mockResolvedValue('hashedpassword'),
		comparePassword: vi.fn().mockResolvedValue(true)
	};

	const usersService = new UsersService(usersRepositoryMock, passwordServiceMock);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Add User', () => {
		it('should add a new user successfully', async () => {
			const params: AddUserParams = { username: 'testuser', password: 'password123' };

			const createdUser = User.fromPersistence({
				username: params.username,
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			usersRepositoryMock.create.mockResolvedValue({
				id: 1,
				user: createdUser
			});

			const result = await usersService.addUser(params);

			expect(passwordServiceMock.hashPassword).toHaveBeenCalledWith(params.password);
			expect(usersRepositoryMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					username: params.username,
					passwordHash: 'hashedpassword'
				})
			);
			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: params.username,
					passwordHash: 'hashedpassword'
				})
			});
		});
	});

	describe('Get User By ID', () => {
		it('should return user when user exists', async () => {
			const user = User.fromPersistence({
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			usersRepositoryMock.getById.mockResolvedValue({
				id: 1,
				user
			});

			const result = await usersService.getUserById(1);

			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(1);

			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: user.username,
					passwordHash: user.passwordHash
				})
			});
		});

		it('should throw EntityNotFoundError when user does not exist', async () => {
			usersRepositoryMock.getById.mockResolvedValue(null);

			await expect(usersService.getUserById(999)).rejects.toThrow(EntityNotFoundError);
			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(999);
		});
	});

	describe('Get User By Username', () => {
		it('should return user when user exists', async () => {
			const user = User.fromPersistence({
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			usersRepositoryMock.getByUsername.mockResolvedValue({
				id: 1,
				user
			});

			const result = await usersService.getUserByUsername('testuser');

			expect(usersRepositoryMock.getByUsername).toHaveBeenCalledWith('testuser');
			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: user.username,
					passwordHash: user.passwordHash
				})
			});
		});

		it('should throw EntityNotFoundError when user does not exist', async () => {
			usersRepositoryMock.getByUsername.mockResolvedValue(null);

			await expect(usersService.getUserByUsername('nonexistent')).rejects.toThrow(
				EntityNotFoundError
			);
			expect(usersRepositoryMock.getByUsername).toHaveBeenCalledWith('nonexistent');
		});
	});

	describe('Update User', () => {
		it('should update user successfully', async () => {
			const existingUser = User.fromPersistence({
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const params: UpdateUserParams = {
				id: 1,
				username: 'updateduser',
				password: 'newpassword123'
			};

			const updatedUser = User.fromPersistence({
				username: params.username!,
				passwordHash: 'hashedpassword',
				createdAt: existingUser.createdAt,
				updatedAt: new Date()
			});

			usersRepositoryMock.getById.mockResolvedValue({
				id: 1,
				user: existingUser
			});
			usersRepositoryMock.update.mockResolvedValue({
				id: 1,
				user: updatedUser
			});

			const result = await usersService.updateUser(params);

			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(params.id);
			expect(passwordServiceMock.hashPassword).toHaveBeenCalledWith(params.password);
			expect(usersRepositoryMock.update).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					username: params.username,
					passwordHash: 'hashedpassword'
				})
			);
			expect(result).toEqual({
				id: expect.any(Number),
				user: expect.objectContaining({
					username: params.username,
					passwordHash: 'hashedpassword'
				})
			});
		});

		it('should throw EntityNotFoundError when user to update does not exist', async () => {
			usersRepositoryMock.getById.mockResolvedValue(null);
			const params: UpdateUserParams = {
				id: 999,
				username: 'updateduser',
				password: 'newpassword123'
			};

			await expect(usersService.updateUser(params)).rejects.toThrow(EntityNotFoundError);
			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(params.id);
		});
	});

	describe('Delete User', () => {
		it('should delete user successfully', async () => {
			const existingUser = User.fromPersistence({
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const params = { targetId: 1 };

			usersRepositoryMock.getById.mockResolvedValue({
				id: 1,
				user: existingUser
			});
			usersRepositoryMock.delete.mockResolvedValue();

			await usersService.deleteUser(params);

			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(usersRepositoryMock.delete).toHaveBeenCalledWith(1);
		});

		it('should throw EntityNotFoundError when user to delete does not exist', async () => {
			usersRepositoryMock.getById.mockResolvedValue(null);
			const params = { targetId: 999 };

			await expect(usersService.deleteUser(params)).rejects.toThrow(EntityNotFoundError);
			expect(usersRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
		});
	});
});
