import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionsRepository } from '../../session.repository';
import { Session } from '../../session.domain';
import type { DbClient } from '$lib/types/prisma/prisma.service.types';

describe('Session Repository Unit', () => {
	const prismaMock = {
		session: {
			create: vi.fn(),
			delete: vi.fn(),
			update: vi.fn(),
			findUnique: vi.fn()
		}
	};

	const sessionRepository = new SessionsRepository(prismaMock as unknown as DbClient);

	const record = {
		id: 1,
		tokenHash: 'hashed_token',
		userId: 1,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
		createdAt: new Date(),
		updatedAt: new Date()
	};

	let session: Session;

	beforeEach(() => {
		session = Session.fromPersistence(record);

		vi.clearAllMocks();
	});

	describe('Create Session', () => {
		it('should create a session successfully', async () => {
			prismaMock.session.create.mockResolvedValue(record);

			const result = await sessionRepository.create(session);

			expect(prismaMock.session.create).toHaveBeenCalledWith({
				data: {
					tokenHash: session.tokenHash,
					userId: session.userId,
					expiresAt: session.expiresAt
				}
			});
			expect(result).toEqual(session);
		});
	});

	describe('Delete Session', () => {
		it('should delete a session successfully', async () => {
			prismaMock.session.delete.mockResolvedValue({});

			await sessionRepository.delete(session);

			expect(prismaMock.session.delete).toHaveBeenCalledWith({
				where: { id: session.id! }
			});
		});
	});

	describe('Update Session', () => {
		it('should update a session successfully', async () => {
			const updatedRecord = { ...record, expiresAt: new Date(Date.now() + 1000 * 60 * 120) }; // 2 hours from now
			prismaMock.session.update.mockResolvedValue(updatedRecord);

			const updatedSession = Session.fromPersistence(updatedRecord);
			const result = await sessionRepository.update(updatedSession);

			expect(prismaMock.session.update).toHaveBeenCalledWith({
				where: { id: updatedSession.id! },
				data: {
					tokenHash: updatedSession.tokenHash,
					userId: updatedSession.userId,
					expiresAt: updatedSession.expiresAt
				}
			});
			expect(result).toEqual(updatedSession);
		});
	});

	describe('Get Session By Token Hash', () => {
		it('should return a session when found', async () => {
			prismaMock.session.findUnique.mockResolvedValue(record);

			const result = await sessionRepository.getSessionByTokenHash(session.tokenHash!);

			expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
				where: { tokenHash: session.tokenHash }
			});
			expect(result).toEqual(session);
		});

		it('should return null when session not found', async () => {
			prismaMock.session.findUnique.mockResolvedValue(null);

			const result = await sessionRepository.getSessionByTokenHash('non_existent_hash');

			expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
				where: { tokenHash: 'non_existent_hash' }
			});
			expect(result).toBeNull();
		});
	});
});
