import { DATABASE_URL } from '$env/static/private';
import type { IPrismaService } from '$lib/types/prisma/prisma.service.types';
import { Prisma, PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError
} from '@prisma/client/runtime/client';
import {
	NotFoundError,
	UnknownRepositoryError,
	ValidationError
} from '../common/errors/errors.repository';

function mapPrismaError(err: unknown): never {
	if (err instanceof PrismaClientValidationError) {
		throw new ValidationError(err.message);
	}

	if (err instanceof PrismaClientKnownRequestError) {
		if (err.code === 'P2025') {
			throw new NotFoundError();
		}

		throw new UnknownRepositoryError(err.message);
	}

	if (
		err instanceof PrismaClientRustPanicError ||
		err instanceof PrismaClientInitializationError ||
		err instanceof PrismaClientUnknownRequestError
	) {
		throw new UnknownRepositoryError(err.message);
	}

	throw new UnknownRepositoryError('Unknown error');
}

export class PrismaService implements IPrismaService {
	private readonly _client: PrismaClient;

	constructor() {
		const adapter = new PrismaPg({
			connectionString: DATABASE_URL
		});

		this._client = new PrismaClient({ adapter });
	}

	static async safeExecuteOrThrow<T>(fn: () => Promise<T | null>): Promise<T | null> {
		try {
			return await fn();
		} catch (err) {
			mapPrismaError(err);
		}
	}

	static async executeOrThrow<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn();
		} catch (err) {
			mapPrismaError(err);
		}
	}

	async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
		return this._client.$transaction(fn);
	}

	get client(): PrismaClient {
		return this._client;
	}
}

let prismaService: IPrismaService | null = null;

export const getPrismaService = () => {
	if (!prismaService) {
		prismaService = new PrismaService();
	}
	return prismaService;
};
