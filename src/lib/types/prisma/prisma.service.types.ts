import type { Prisma, PrismaClient } from '$lib/server/api/prisma/generated/client';

export enum SortDirection {
	ASC = 'asc',
	DESC = 'desc'
}

export type PaginationOptions = {
	offset?: number;
	limit?: number;
};

export type SortOptions<T extends string> = {
	field?: T;
	direction?: SortDirection;
};

export type DbClient = PrismaClient | Prisma.TransactionClient;

export interface IPrismaService {
	get client(): PrismaClient;
	transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
