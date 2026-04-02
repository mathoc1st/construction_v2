import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/wasm-compiler-edge';
import { Prisma, PrismaClient } from './generated/client';
import type { DbClient, IPrismaService } from './prisma.types';

export class PrismaService implements IPrismaService {
	private readonly _client: DbClient;

	constructor(adapter: SqlDriverAdapterFactory) {
		this._client = new PrismaClient({ adapter });
	}

	get client(): DbClient {
		return this._client;
	}

	async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
		return this._client.$transaction(fn);
	}
}
