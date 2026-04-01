import { describe, expect, it } from 'vitest';
import { User } from '../../user.domain';

describe('User Domain Unit', () => {
	describe('User Creation', () => {
		it('should create a user with valid parameters', () => {
			const user = User.create({ username: 'testuser', passwordHash: 'hashedpassword' });
			expect(user.username).toBe('testuser');
			expect(user.passwordHash).toBe('hashedpassword');
			expect(user.id).toBeNull();
		});

		it('should create a user from persistence', () => {
			const user = User.fromPersistence({
				id: 1,
				username: 'testuser',
				passwordHash: 'hashedpassword',
				createdAt: new Date(),
				updatedAt: new Date()
			});
			expect(user.id).toBe(1);
			expect(user.username).toBe('testuser');
			expect(user.passwordHash).toBe('hashedpassword');
		});
	});
});
