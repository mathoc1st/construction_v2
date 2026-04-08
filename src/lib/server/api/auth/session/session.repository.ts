import { Session, SessionId } from './session.domain';
import { Prisma } from '$lib/server/api/prisma/generated/client';
import type { ISessionsRepository } from './session.types';
import type { DbClient } from '$lib/types/prisma/prisma.service.types';
import { User, UserId } from '../../users/user.domain';

export class SessionsRepository implements ISessionsRepository {
	constructor(private readonly _client: DbClient) {}

	async getSessionByTokenHash(tokenHash: string): Promise<Session | null> {
		const record = await this._client.session.findUnique({
			where: { tokenHash }
		});

		if (!record) {
			return null;
		}

		return Session.fromPersistence({
			...record,
			id: new SessionId(record.id),
			userId: new UserId(record.userId)
		});
	}

	async getUserBySessionTokenHash(tokenHash: string): Promise<User | null> {
		const record = await this._client.session.findUnique({
			where: { tokenHash },
			include: {
				user: true
			}
		});

		return record
			? User.fromPersistence({
					...record.user,
					id: new UserId(record.user.id)
				})
			: null;
	}

	async create(session: Session): Promise<Session> {
		const record = await this._client.session.create({
			data: this.toPrismaSession(session)
		});

		return Session.fromPersistence({
			...record,
			id: new SessionId(record.id),
			userId: new UserId(record.userId)
		});
	}

	async delete(session: Session): Promise<void> {
		await this._client.session.delete({
			where: { id: session.id.value }
		});
		return;
	}

	async update(session: Session): Promise<Session> {
		const record = await this._client.session.update({
			where: { id: session.id.value },
			data: this.toPrismaSession(session)
		});

		return Session.fromPersistence({
			...record,
			id: new SessionId(record.id),
			userId: new UserId(record.userId)
		});
	}

	private toPrismaSession(session: Session): Prisma.SessionUncheckedCreateInput {
		return {
			id: session.id.value,
			tokenHash: session.tokenHash!,
			userId: session.userId.value,
			expiresAt: session.expiresAt
		};
	}
}

let sessionsRepository: ISessionsRepository | null = null;

export const getSessionsRepository = (client: DbClient) => {
	if (!sessionsRepository) {
		sessionsRepository = new SessionsRepository(client);
	}
	return sessionsRepository;
};
