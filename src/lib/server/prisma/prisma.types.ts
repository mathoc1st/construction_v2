import type { PrismaClient } from './generated/client';

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

export interface IPrismaService {
	get client(): PrismaClient;
}
