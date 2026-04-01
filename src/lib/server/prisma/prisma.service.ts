import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { IPrismaService } from './prisma.types';

export class PrismaService implements IPrismaService {
	private readonly _client: PrismaClient;

	constructor(adapter: SqlDriverAdapterFactory) {
		this._client = new PrismaClient({ adapter });
	}

	get client(): PrismaClient {
		return this._client;
	}
}

let prismaService: PrismaService | null = null;

export const getPrismaService = () => {
	if (!prismaService) {
		const adapter = new PrismaPg({
			connectionString: 'asd'
		});

		prismaService = new PrismaService(adapter);
	}
	return prismaService;
};
