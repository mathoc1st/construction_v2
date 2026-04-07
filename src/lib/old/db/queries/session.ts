import prisma from '../prisma';

export async function createNewSession(userId: number, sessionId: string, expiresAt: Date) {
	return prisma.session.create({
		data: {
			userId,
			sessionID: sessionId,
			expiresAt
		}
	});
}

export async function getSessionWithUser(sessionId: string) {
	return prisma.session.findUnique({
		where: { sessionID: sessionId },
		include: {
			user: true
		}
	});
}

export async function deleteSession(sessionId: string) {
	return prisma.session.delete({
		where: { sessionID: sessionId }
	});
}

export async function updateSessionExpiration(sessinId: string, expiresAt: Date) {
	return prisma.session.update({
		where: { sessionID: sessinId },
		data: {
			expiresAt
		}
	});
}
