import { DATABASE_URL } from '$env/static/private';
import type { IPrismaService } from '$lib/types/prisma/prisma.service.types';
import { Prisma, PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

export class PrismaService implements IPrismaService {
	private readonly _client: PrismaClient;

	constructor() {
		const adapter = new PrismaPg({
			connectionString: DATABASE_URL
		});

		this._client = new PrismaClient({ adapter });
	}

	get client(): PrismaClient {
		return this._client;
	}

	async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
		return this._client.$transaction(fn);
	}
}

let prismaService: IPrismaService | null = null;

export const getPrismaService = () => {
	if (!prismaService) {
		prismaService = new PrismaService();
	}
	return prismaService;
};
