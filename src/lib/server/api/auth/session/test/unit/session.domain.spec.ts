import { describe, expect, it } from 'vitest';
import { Session } from '../../session.domain';

describe('Session Domain Unit', () => {
	describe('Session Creation', () => {
		it('should create a session with valid parameters', () => {
			const session = Session.create({
				tokenHash: 'testTokenHash',
				userId: 1,
				expiresAt: new Date(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
			});

			expect(session).toBeInstanceOf(Session);
			expect(session.tokenHash).toBe('testTokenHash');
			expect(session.userId).toBe(1);
			expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
		});

		it('should create a session from persistence with valid parameters', () => {
			const now = new Date();
			const session = Session.fromPersistence({
				id: 1,
				tokenHash: 'testTokenHash',
				userId: 1,
				expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // Expires in 1 hour
				createdAt: now,
				updatedAt: null
			});

			expect(session).toBeInstanceOf(Session);
			expect(session.id).toBe(1);
			expect(session.tokenHash).toBe('testTokenHash');
			expect(session.userId).toBe(1);
			expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
			expect(session.createdAt.getTime()).toBe(now.getTime());
			expect(session.updatedAt).toBeNull();
		});
	});

	describe('Session Expiration', () => {
		it('should return false for a session that has not expired', () => {
			const session = Session.create({
				tokenHash: 'testTokenHash',
				userId: 1,
				expiresAt: new Date(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
			});

			expect(session.hasExpired()).toBe(false);
		});

		it('should return true for a session that has expired', () => {
			const session = Session.create({
				tokenHash: 'testTokenHash',
				userId: 1,
				expiresAt: new Date(Date.now() - 60 * 60 * 1000) // Expired 1 hour ago
			});

			expect(session.hasExpired()).toBe(true);
		});
	});
});
