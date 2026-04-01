import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import type {
	CreateSessionParams,
	InvalidateSessionParams,
	ISessionRepository,
	ISessionService,
	CreationSessionResult,
	ValidateSessionResult
} from '../../session.types';
import { SessionService } from '../../session.service';
import { Session } from '../../session.domain';

describe('Session Service Unit', () => {
	const sessionRepositoryMock: Mocked<ISessionRepository> = {
		create: vi.fn(),
		delete: vi.fn(),
		update: vi.fn(),
		getSessionByTokenHash: vi.fn()
	};

	const sessionService: ISessionService = new SessionService(sessionRepositoryMock);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Create Session', () => {
		it('should create a session successfully', async () => {
			const params: CreateSessionParams = { userId: 1 };

			const session: Session = Session.fromPersistence({
				id: 1,
				tokenHash: 'hashed-token',
				userId: 1,
				expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
				createdAt: new Date(),
				updatedAt: null
			});

			sessionRepositoryMock.create.mockResolvedValue(session);

			const result: CreationSessionResult = await sessionService.createSession(params);

			expect(sessionRepositoryMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: params.userId,
					tokenHash: expect.any(String),
					expiresAt: expect.any(Date)
				})
			);
			expect(result.session).toEqual(session);
		});
	});

	describe('Validate Session', () => {
		it('should validate a valid session successfully', async () => {
			const token = 'valid-token';
			const tokenHash = 'hashed-valid-token';
			const session: Session = Session.fromPersistence({
				id: 1,
				tokenHash,
				userId: 1,
				expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
				createdAt: new Date(),
				updatedAt: null
			});

			sessionRepositoryMock.getSessionByTokenHash.mockResolvedValue(session);

			const result: ValidateSessionResult = await sessionService.validateSession({ token });

			expect(sessionRepositoryMock.getSessionByTokenHash).toHaveBeenCalledWith(expect.any(String));
			expect(result).toEqual({ status: 'valid', session });
		});

		it('should return expired status for an expired session', async () => {
			const token = 'expired-token';
			const tokenHash = 'hashed-expired-token';
			const session: Session = Session.fromPersistence({
				id: 1,
				tokenHash,
				userId: 1,
				expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
				createdAt: new Date(),
				updatedAt: null
			});

			sessionRepositoryMock.getSessionByTokenHash.mockResolvedValue(session);

			const result: ValidateSessionResult = await sessionService.validateSession({ token });

			expect(sessionRepositoryMock.getSessionByTokenHash).toHaveBeenCalledWith(expect.any(String));
			expect(result).toEqual({ status: 'expired', session });
		});

		it('should return invalid status for a non-existent session', async () => {
			const token = 'invalid-token';

			sessionRepositoryMock.getSessionByTokenHash.mockResolvedValue(null);

			const result: ValidateSessionResult = await sessionService.validateSession({ token });

			expect(sessionRepositoryMock.getSessionByTokenHash).toHaveBeenCalledWith(expect.any(String));
			expect(result).toEqual({ status: 'invalid' });
		});
	});

	describe('Invalidate Session', () => {
		it('should invalidate a session successfully', async () => {
			const params: InvalidateSessionParams = {
				token: 'valid-token'
			};

			const session: Session = Session.fromPersistence({
				id: 1,
				tokenHash: 'hashed-token',
				userId: 1,
				expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
				createdAt: new Date(),
				updatedAt: null
			});

			sessionRepositoryMock.getSessionByTokenHash.mockResolvedValue(session);

			await sessionService.invalidateSession(params);

			expect(sessionRepositoryMock.getSessionByTokenHash).toHaveBeenCalledWith(expect.any(String));
			expect(sessionRepositoryMock.delete).toHaveBeenCalledWith(session);
		});
	});
});
