import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Listing as DomainListing } from '$lib/server/api/listings/listing.domain';
import { ListingSortableFields } from '$lib/types/listings/listings.repository.types';
import { SortDirection, type DbClient } from '$lib/types/prisma/prisma.service.types';
import {
	ConstructionType,
	FinishType,
	type Listing as PrismaListing
} from '$lib/server/api/prisma/generated/client';
import { ListingsRepository } from '../../listings.repository';

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

	const listingRecord: PrismaListing = {
		id: 1,
		title: 'Title',
		images: ['http://someimage.com'],
		views: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		createdById: 1,
		updatedById: 1,
		deletedById: null
	};

	const buildingRecord = {
		id: 1,
		constructionType: ConstructionType.FRAME,
		width: 10,
		length: 20,
		height: 5,
		bedrooms: 3,
		bathrooms: 2,
		floors: 2,
		veranda: true,
		listingId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		createdById: 1,
		updatedById: 1,
		deletedById: null
	};

	const finishRecord = {
		id: 1,
		type: FinishType.COLD,
		description: 'asd',
		price: 123,
		originalPrice: null,
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
		listing = DomainListing.fromPersistence(listingRecord);

		vi.clearAllMocks();
	});

	describe('Create Listing', () => {
		it('should create a listing successfully', async () => {
			vi.mocked(prismaMock.listing.create).mockResolvedValue(listingRecord);

			const result = await listingsRepository.create(1, listing);

			expect(prismaMock.listing.create).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					data: expect.objectContaining({
						title: listing.title,
						images: listing.images,
						views: listing.views
					})
				})
			);
			expect(result).toEqual({
				id: listingRecord.id,
				listing: expect.objectContaining({
					title: listing.title,
					images: listing.images,
					views: listing.views
				})
			});
		});
	});

	describe('Update Listing', () => {
		it('should update a listing successfully', async () => {
			vi.mocked(prismaMock.listing.update).mockResolvedValue(listingRecord);

			const result = await listingsRepository.update(1, listing);

			expect(prismaMock.listing.update).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					where: {
						id: 1
					},
					data: expect.objectContaining({
						title: listing.title,
						images: listing.images,
						views: listing.views
					})
				})
			);
			expect(result).toEqual({
				id: listingRecord.id,
				listing: expect.objectContaining({
					title: listing.title,
					images: listing.images,
					views: listing.views
				})
			});
		});
	});

	describe('Delete Listing', () => {
		it('should delete a listing successfully', async () => {
			await listingsRepository.delete(1);

			expect(prismaMock.listing.delete).toHaveBeenCalledWith({
				where: {
					id: 1
				}
			});
		});
	});

	describe('Get Listing By ID', () => {
		it('should get a listing by id successfully', async () => {
			vi.mocked(prismaMock.listing.findUnique).mockResolvedValue(listingRecord);

			const result = await listingsRepository.getListingById(1);

			expect(prismaMock.listing.findUnique).toHaveBeenCalledExactlyOnceWith({
				where: {
					id: 1
				}
			});
			expect(result).toEqual({
				id: listingRecord.id,
				listing: expect.objectContaining({
					title: listing.title,
					images: listing.images,
					views: listing.views
				})
			});
		});
	});

	describe('Get Listing By ID With Relations', () => {
		it('should get a listing by id with relations successfully', async () => {
			vi.mocked(prismaMock.listing.findUnique).mockResolvedValue({
				...listingRecord,
				building: {
					...buildingRecord,
					finishes: [finishRecord]
				}
			});

			const result = await listingsRepository.getListingByIdWithRelations(1);

			expect(prismaMock.listing.findUnique).toHaveBeenCalledExactlyOnceWith({
				where: {
					id: 1
				},
				include: {
					building: {
						include: {
							finishes: true
						}
					}
				}
			});

			expect(result).toEqual({
				listing: {
					id: listingRecord.id,
					record: expect.objectContaining({
						title: listing.title,
						images: listing.images,
						views: listing.views
					})
				},
				building: {
					id: buildingRecord.id,
					record: expect.objectContaining({
						constructionType: buildingRecord.constructionType,
						width: buildingRecord.width,
						length: buildingRecord.length,
						height: buildingRecord.height,
						bedrooms: buildingRecord.bedrooms,
						bathrooms: buildingRecord.bathrooms,
						floors: buildingRecord.floors,
						veranda: buildingRecord.veranda
					})
				},
				finishes: expect.arrayContaining([
					{
						id: finishRecord.id,
						record: expect.objectContaining({
							type: finishRecord.type,
							description: finishRecord.description,
							price: finishRecord.price,
							originalPrice: finishRecord.originalPrice
						})
					}
				])
			});
		});
	});

	describe('Find All Listings', () => {
		it('should find all listings matching the specified criteria', async () => {
			vi.mocked(prismaMock.listing.findMany).mockResolvedValue([listingRecord]);

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
			expect(result).toEqual(
				expect.arrayContaining([
					{
						id: listingRecord.id,
						listing: expect.objectContaining({
							title: listing.title,
							images: listing.images,
							views: listing.views
						})
					}
				])
			);
		});
	});
});
