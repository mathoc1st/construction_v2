import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { Session } from './session.domain';
import type {
	CreateSessionParams,
	ISessionsRepository,
	ISessionsService,
	ValidateSessionParams,
	ValidateSessionResult,
	InvalidateSessionParams
} from './session.types';
import { sha256 } from '@oslojs/crypto/sha2';
import { getSessionsRepository } from './session.repository';
import { getPrismaService } from '$lib/server/api/prisma/prisma.service';

const DAY_IN_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
export class SessionsService implements ISessionsService {
	constructor(private readonly sessionRepository: ISessionsRepository) {}

	async createSession(params: CreateSessionParams): Promise<{ session: Session; token: string }> {
		const token = this.generateSessionToken();
		const session = Session.create({
			userId: params.userId,
			tokenHash: this.generateTokenHash(token),
			expiresAt: new Date(Date.now() + DAY_IN_MS)
		});

		const createdSession = await this.sessionRepository.create(session);

		return { session: createdSession, token };
	}

	async validateSession(params: ValidateSessionParams): Promise<ValidateSessionResult> {
		const tokenHash = this.generateTokenHash(params.token);
		const session = await this.sessionRepository.getSessionByTokenHash(tokenHash);

		if (!session) {
			return { status: 'invalid' };
		}

		if (Date.now() >= session.expiresAt.getTime()) {
			return { status: 'expired', session };
		}

		return { status: 'valid', session };
	}

	async invalidateSession(params: InvalidateSessionParams): Promise<void> {
		const tokenHash = this.generateTokenHash(params.token);
		const session = await this.sessionRepository.getSessionByTokenHash(tokenHash);
		if (session) {
			await this.sessionRepository.delete(session);
		}
	}

	async getUserBySessionToken(token: string) {
		const tokenHash = this.generateTokenHash(token);
		return this.sessionRepository.getUserBySessionTokenHash(tokenHash);
	}

	private generateSessionToken() {
		const bytes = crypto.getRandomValues(new Uint8Array(18));
		const token = encodeBase64url(bytes);
		return token;
	}

	private generateTokenHash(token: string) {
		return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	}
}

let sessionsService: ISessionsService | null = null;

export const getSessionsService = () => {
	const prismaService = getPrismaService();

	if (!sessionsService) {
		sessionsService = new SessionsService(getSessionsRepository(prismaService.client));
	}
	return sessionsService;
};
