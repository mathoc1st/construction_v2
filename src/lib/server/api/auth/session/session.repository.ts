import type { PrismaService } from '$lib/server/prisma/prisma.service';
import { Session } from './session.domain';
import { Prisma } from '$lib/server/prisma/generated/client';
import type { ISessionRepository } from './session.types';

export class SessionRepository implements ISessionRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getSessionByTokenHash(tokenHash: string): Promise<Session | null> {
		const record = await this.prismaService.client.session.findUnique({
			where: { tokenHash }
		});

		if (!record) {
			return null;
		}

		return Session.fromPersistence(record);
	}

	async create(session: Session): Promise<Session> {
		const record = await this.prismaService.client.session.create({
			data: this.toPrismaSession(session)
		});

		return Session.fromPersistence(record);
	}

	async delete(session: Session): Promise<void> {
		await this.prismaService.client.session.delete({
			where: { id: session.id! }
		});
		return;
	}

	async update(session: Session): Promise<Session> {
		const record = await this.prismaService.client.session.update({
			where: { id: session.id! },
			data: this.toPrismaSession(session)
		});

		return Session.fromPersistence(record);
	}

	private toPrismaSession(session: Session): Prisma.SessionUncheckedCreateInput {
		return {
			tokenHash: session.tokenHash!,
			userId: session.userId,
			expiresAt: session.expiresAt
		};
	}
}
