import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ListingsRepository } from '../../listings.repository';
import { Listing as DomainListing } from '../../listing.domain';
import { ListingSortableFields } from '../../listing.types';
import { SortDirection, type DbClient } from '$lib/server/prisma/prisma.types';
import type { Listing as PrismaListing } from '$lib/server/prisma/generated/client';

describe('Listing Repository Unit', () => {
	const prismaMock = {
		listing: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findUnique: vi.fn(),
			findMany: vi.fn()
		}
	};

	const listingsRepository = new ListingsRepository(prismaMock as unknown as DbClient);

	const record: PrismaListing = {
		id: 1,
		title: 'Title',
		images: ['http://someimage.com'],
		views: 1,
		buildingId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		createdById: 1,
		updatedById: 1,
		deletedById: null
	};

	let listing: DomainListing;

	beforeEach(() => {
		listing = DomainListing.fromPersistence(record);

		vi.clearAllMocks();
	});

	describe('Create Listing', () => {
		it('should create a listing successfully', async () => {
			vi.mocked(prismaMock.listing.create).mockResolvedValue(record);

			const result = await listingsRepository.create(listing);

			expect(prismaMock.listing.create).toHaveBeenCalled();
			expect(result).toBeInstanceOf(DomainListing);
			expect(result).toStrictEqual(DomainListing.fromPersistence(record));
		});
	});

	describe('Update Listing', () => {
		it('should update a listing successfully', async () => {
			vi.mocked(prismaMock.listing.update).mockResolvedValue(record);

			const result = await listingsRepository.update(listing);

			expect(prismaMock.listing.update).toHaveBeenCalled();
			expect(result).toBeInstanceOf(DomainListing);
			expect(result).toStrictEqual(DomainListing.fromPersistence(record));
		});

		it('should throw an exception if the id of the listing is not defined or null', async () => {
			await expect(listingsRepository.update(DomainListing.create(record))).rejects.toThrow();
		});
	});

	describe('Soft Delete Listing', () => {
		it('should soft delete a listing successfully', async () => {
			const deletedRecord: PrismaListing = { ...record, deletedAt: new Date(), deletedById: 1 };

			prismaMock.listing.update.mockResolvedValue(deletedRecord);

			const deletedListing = DomainListing.fromPersistence(deletedRecord);

			await listingsRepository.softDelete(deletedListing);

			expect(prismaMock.listing.update).toHaveBeenCalledWith({
				where: {
					id: deletedListing.id
				},
				data: {
					deletedAt: deletedListing.deletedAt,
					deletedById: deletedListing.deletedById
				}
			});
		});
	});

	describe('Delete Listing', () => {
		it('should delete a listing successfully', async () => {
			await listingsRepository.delete(listing);

			expect(prismaMock.listing.delete).toHaveBeenCalledWith({
				where: {
					id: record.id
				}
			});
		});
	});

	describe('Get Listing By ID', () => {
		it('should get a listing by id successfully', async () => {
			vi.mocked(prismaMock.listing.findUnique).mockResolvedValue(record);

			const result = await listingsRepository.getListingById(1);

			expect(prismaMock.listing.findUnique).toHaveBeenCalled();
			expect(result).toBeInstanceOf(DomainListing);
			expect(result).toStrictEqual(DomainListing.fromPersistence(record));
		});
	});

	describe('Find All Listings', () => {
		it('should find all listings matching the specified criteria', async () => {
			vi.mocked(prismaMock.listing.findMany).mockResolvedValue([record]);

			const result = await listingsRepository.findAll({
				sort: {
					field: ListingSortableFields.CREATED_AT
				},
				pagination: {
					offset: 1,
					limit: 10
				}
			});

			expect(prismaMock.listing.findMany).toHaveBeenCalledWith({
				where: {},
				orderBy: {
					createdAt: SortDirection.ASC
				},
				take: 10,
				skip: 1
			});
			expect(result).toBeInstanceOf(Array);
			expect(result).toEqual(expect.arrayContaining([DomainListing.fromPersistence(record)]));
		});
	});
});
