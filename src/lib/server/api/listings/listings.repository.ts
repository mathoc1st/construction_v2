import type { Prisma, Listing as ListingModel } from '$lib/server/prisma/generated/client';
import {
	SortDirection,
	type IPrismaService,
	type SortOptions
} from '$lib/server/prisma/prisma.types';
import { Listing } from './listing.domain';
import type {
	IListingsRepository,
	ListingFilterOptions,
	ListingQueryOptions,
	ListingSortableFields
} from './listing.types';

export class ListingsRepository implements IListingsRepository {
	constructor(private prismaService: IPrismaService) {}

	async getListingById(id: number): Promise<Listing | null> {
		const record = await this.prismaService.client.listing.findUnique({
			where: {
				id
			}
		});

		if (!record) return null;

		return Listing.fromPersistence(record);
	}

	async findAll(options?: ListingQueryOptions): Promise<Listing[]> {
		const record = await this.prismaService.client.listing.findMany({
			where: this.buildWhere(options?.filters),
			orderBy: this.buildOrderBy(options?.sort),
			take: options?.pagination?.limit,
			skip: options?.pagination?.offset
		});

		return record.map((r) => Listing.fromPersistence(r));
	}

	async create(listing: Listing): Promise<Listing> {
		const model = this.toModel(listing);
		const record = await this.prismaService.client.listing.create({
			data: model
		});

		return Listing.fromPersistence(record);
	}

	async update(listing: Listing): Promise<Listing> {
		if (listing.id == null) throw new Error('Invalid Listing id');

		const model = this.toModel(listing);
		const record = await this.prismaService.client.listing.update({
			where: {
				id: listing.id
			},
			data: model
		});

		return Listing.fromPersistence(record);
	}

	async softDelete(listing: Listing): Promise<void> {
		await this.prismaService.client.listing.update({
			where: {
				id: listing.id!
			},
			data: {
				deletedAt: listing.deletedAt,
				deletedById: listing.deletedById
			}
		});

		return;
	}

	async delete(listing: Listing): Promise<void> {
		await this.prismaService.client.listing.delete({ where: { id: listing.id! } });
	}

	private toModel(listing: Listing): Omit<ListingModel, 'id'> & { id?: number } {
		return {
			id: listing.id ?? undefined,
			title: listing.title,
			images: listing.images,
			views: listing.views,
			createdAt: listing.createdAt,
			updatedAt: listing.updatedAt,
			deletedAt: listing.deletedAt,
			createdById: listing.createdById,
			updatedById: listing.updatedById,
			deletedById: listing.deletedById,
			buildingId: listing.buildingId
		};
	}

	private buildWhere(filters?: ListingFilterOptions): Prisma.ListingWhereInput {
		const where: Prisma.ListingWhereInput = {};

		if (filters?.title) {
			where.title = { contains: filters.title };
		}

		return where;
	}

	private buildOrderBy(
		sort?: SortOptions<ListingSortableFields>
	): Prisma.ListingOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction ? sort.direction : SortDirection.ASC
		};
	}
}
