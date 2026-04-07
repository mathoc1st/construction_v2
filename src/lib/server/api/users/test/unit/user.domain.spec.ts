import { describe, expect, it } from 'vitest';
import { User } from '../../user.domain';

describe('User Domain Unit', () => {
	describe('User Creation', () => {
		it('should create a user with valid parameters', () => {
			const user = User.create({ username: 'testuser', passwordHash: 'hashedpassword' });
			expect(user.username).toBe('testuser');
			expect(user.passwordHash).toBe('hashedpassword');
		});

		it('should throw an error when creating a user with an empty username', () => {
			expect(() => User.create({ username: '   ', passwordHash: 'hashedpassword' })).toThrow(
				'username cannot be an empty string'
			);
		});

		it('should throw an error when creating a user with an empty password hash', () => {
			expect(() => User.create({ username: 'testuser', passwordHash: '   ' })).toThrow(
				'passwordHash cannot be an empty string'
			);
		});

		it('should create a user from persistence', () => {
			const user = User.fromPersistence({
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});
			expect(user.username).toBe('testuser');
			expect(user.passwordHash).toBe('hashedpassword');
		});
	});
});
