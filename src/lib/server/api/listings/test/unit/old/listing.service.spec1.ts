import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { ListingsService } from '../../../listings.service';
import {
	type AddListingParams,
	type AddListingWithRelationsParams,
	type DeleteListingParams,
	type FindListingsParams,
	type IListingsService,
	type UpdateListingParams,
	type UpdateListingWithRelationsParams
} from '$lib/types/listings/listings.service.types';
import { Listing } from '../../../listing.domain';
import { SortDirection, type IPrismaService } from '$lib/types/prisma/prisma.service.types';
import { type IFinishesService } from '$lib/types/finishes/finishes.service.types';
import type { IBuildingsService } from '$lib/types/buildings/buildings.service.types';
import { Building } from '$lib/server/api/buildings/building.domain';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { Finish } from '$lib/server/api/finishes/finish.domain';
import {
	ListingSortableFields,
	type IListingsRepository
} from '$lib/types/listings/listings.repository.types';
import type { IBuildingsRepository } from '$lib/types/buildings/buildings.repository.types';
import type { IFinishesRepository } from '$lib/types/finishes/finishes.repository.types';
import { FinishType } from '$lib/types/finishes/finish.domain.types';
import type { IMinioService } from '$lib/types/minio/minio.service.types';

describe('Listing Service Unit', () => {
	const mockTx = {};

	const prismaMock = {
		transaction: vi.fn(async (fn) => {
			return fn(mockTx);
		})
	};

	const prismaServiceMock = {
		transaction: prismaMock.transaction
	} as unknown as IPrismaService;

	const minioServiceMock: Mocked<IMinioService> = {
		generatePresignedGetUrl: vi.fn(),
		moveObject: vi.fn(),
		uploadImages: vi.fn(),
		client: {} as unknown as IMinioService['client']
	};

	const buildingsServiceMock: Mocked<IBuildingsService> = {
		withRepository: vi.fn(() => {
			return buildingsServiceMock;
		}),
		getBuildingById: vi.fn(),
		addBuilding: vi.fn(),
		updateBuilding: vi.fn(),
		deleteBuilding: vi.fn(),
		findBuildings: vi.fn()
	};

	const finishesServiceMock: Mocked<IFinishesService> = {
		withRepository: vi.fn(() => {
			return finishesServiceMock;
		}),
		addFinish: vi.fn(),
		updateFinish: vi.fn(),
		deleteFinish: vi.fn(),
		reconcileFinishes: vi.fn(),
		softDeleteFinish: vi.fn()
	};

	const listingRepositoryMock: Mocked<IListingsRepository> = {
		getListingByIdWithRelations: vi.fn(),
		getById: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		createListingWithRelations: vi.fn(),
		withClient: vi.fn(() => listingRepositoryMock),
		getBuildingIdByListingId: vi.fn(),
		findListingsByBuildingType: vi.fn()
	};

	const buildingRepositoryMock: Mocked<IBuildingsRepository> = {
		getById: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		findAllCount: vi.fn(),
		withClient: vi.fn(() => buildingRepositoryMock)
	};

	const finishRepositoryMock: Mocked<IFinishesRepository> = {
		getById: vi.fn(),
		findAllCount: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		withClient: vi.fn(() => finishRepositoryMock)
	};

	const listingService: IListingsService = new ListingsService(
		minioServiceMock,
		prismaServiceMock,
		buildingsServiceMock,
		finishesServiceMock,
		listingRepositoryMock,
		buildingRepositoryMock,
		finishRepositoryMock
	);

	let listing: Listing;

	beforeEach(() => {
		listing = Listing.fromPersistence({
			title: 'Test Listing',
			images: ['image1.jpg'],
			createdById: 1,
			updatedAt: new Date(),
			createdAt: new Date(),
			deletedAt: null,
			updatedById: 1,
			deletedById: null,
			views: 0
		});

		vi.clearAllMocks();
	});

	describe('Add Listing', () => {
		it('should add a new listing successfully', async () => {
			const params: AddListingParams = {
				performedById: 1,
				title: 'Test Listing',
				images: ['image1.jpg'],
				buildingId: 1
			};

			listingRepositoryMock.create.mockResolvedValueOnce({
				id: 1,
				listing: Listing.create({
					title: 'Test Listing',
					images: ['image1.jpg'],
					createdById: 1
				})
			});

			const result = await listingService.addListing(params);

			expect(result).toEqual({
				id: 1,
				listing: expect.objectContaining({
					title: 'Test Listing',
					images: ['image1.jpg']
				})
			});
		});
	});

	describe('Add listing with relations', () => {
		it('should add a listing with building and finishes successfully', async () => {
			const params: AddListingWithRelationsParams = {
				performedById: 1,
				building: {
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					veranda: false
				},
				finishes: [
					{
						type: FinishType.COLD,
						description: 'Cold finish',
						price: 1000
					}
				],
				listing: {
					title: 'Test Listing',
					images: ['image1.jpg']
				}
			};

			const building = Building.fromPersistence({
				...params.building,
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null
			});

			const finish = Finish.fromPersistence({
				...params.finishes[0],
				originalPrice: null,
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null
			});

			const listing = Listing.fromPersistence({
				...params.listing,
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null,
				views: 0
			});

			listingRepositoryMock.createListingWithRelations.mockResolvedValueOnce({
				listing: {
					id: 1,
					record: listing
				},
				building: {
					id: 1,
					record: building
				},
				finishes: [
					{
						id: 1,
						record: finish
					}
				]
			});

			const result = await listingService.addListingWithRelations(params);

			expect(result.listing).toEqual({
				id: 1,
				record: expect.objectContaining({
					title: 'Test Listing',
					images: ['image1.jpg']
				})
			});

			expect(result.building).toEqual({
				id: 1,
				record: expect.objectContaining({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					veranda: false
				})
			});
			expect(result.finishes).toEqual([
				{
					id: 1,
					record: expect.objectContaining({
						type: FinishType.COLD,
						description: 'Cold finish',
						price: 1000
					})
				}
			]);
		});
	});

	describe('Update Listing With Relations', () => {
		it('should update a listing with building and finishes successfully', async () => {
			const params: UpdateListingWithRelationsParams = {
				performedById: 1,
				building: {
					listingId: 1,
					constructionType: ConstructionType.CONTAINER,
					width: 15,
					length: 25,
					height: 10,
					bedrooms: 3,
					bathrooms: 2,
					floors: 2,
					hasVeranda: true
				},
				finishes: [
					{
						type: FinishType.WARM_100,
						description: 'Warm finish',
						price: 2000,
						targetId: 1
					}
				],
				listing: {
					title: 'Updated Listing',
					images: ['updated_image.jpg'],
					targetId: 1
				}
			};

			const building = Building.fromPersistence({
				constructionType: ConstructionType.CONTAINER,
				width: 15,
				length: 25,
				height: 10,
				bedrooms: 3,
				bathrooms: 2,
				floors: 2,
				hasVeranda: true,
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null
			});

			const finish = Finish.fromPersistence({
				type: FinishType.WARM_100,
				description: 'Warm finish',
				price: 2000,
				originalPrice: null,
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null
			});

			const listing = Listing.fromPersistence({
				title: 'Updated Listing',
				images: ['updated_image.jpg'],
				createdById: 1,
				updatedAt: new Date(),
				createdAt: new Date(),
				deletedAt: null,
				updatedById: 1,
				deletedById: null,
				views: 0
			});

			buildingsServiceMock.updateBuilding.mockResolvedValueOnce({
				id: 1,
				building
			});
			finishesServiceMock.reconcileFinishes.mockResolvedValueOnce([
				{
					id: 1,
					finish
				}
			]);
			listingRepositoryMock.getById.mockResolvedValue({
				id: 1,
				listing: Listing.create({
					title: 'Test Listing',
					images: ['image1.jpg'],
					createdById: 1
				})
			});
			listingRepositoryMock.update.mockResolvedValueOnce({
				id: 1,
				listing
			});

			const result = await listingService.updateListingWithRelations(params);

			expect(result.listing).toEqual({
				id: 1,
				record: expect.objectContaining({
					title: 'Updated Listing',
					images: ['updated_image.jpg']
				})
			});

			expect(result.building).toEqual({
				id: 1,
				record: expect.objectContaining({
					constructionType: ConstructionType.CONTAINER,
					width: 15,
					length: 25,
					height: 10,
					bedrooms: 3,
					bathrooms: 2,
					floors: 2,
					veranda: true
				})
			});
			expect(result.finishes).toEqual([
				{
					id: 1,
					record: expect.objectContaining({
						type: FinishType.WARM_100,
						description: 'Warm finish',
						price: 2000
					})
				}
			]);
		});
	});

	describe('Update Listing', () => {
		it('should update a listing successfully', async () => {
			const params: UpdateListingParams = {
				targetId: 1,
				performedById: 1,
				title: 'Updated Title',
				images: ['updated_image.jpg']
			};

			listingRepositoryMock.getById.mockResolvedValueOnce({
				id: 1,
				listing
			});
			listingRepositoryMock.update.mockResolvedValueOnce({
				id: 1,
				listing: Listing.create({
					...listing,
					title: 'Updated Title',
					images: ['updated_image.jpg'],
					createdById: 1
				})
			});

			const result = await listingService.update(params);

			expect(result).toEqual({
				id: 1,
				listing: expect.objectContaining({
					title: 'Updated Title',
					images: ['updated_image.jpg']
				})
			});
		});
	});

	describe('Delete Listing', () => {
		it('should delete a listing successfully', async () => {
			const params: DeleteListingParams = {
				id: 1,
				performedById: 1
			};

			listingRepositoryMock.getById.mockResolvedValueOnce({
				id: 1,
				listing: Listing.create({
					title: 'Test Listing',
					images: ['image1.jpg'],
					createdById: 1
				})
			});

			await listingService.deleteListing(params);

			expect(listingRepositoryMock.delete).toHaveBeenCalledWith(1);
		});
	});

	describe('Find Listings', () => {
		it('should find listings successfully', async () => {
			const params: FindListingsParams = {
				performedById: 1,
				filters: {
					title: 'Test'
				},
				sort: {
					field: ListingSortableFields.CREATED_AT,
					direction: SortDirection.DESC
				},
				pagination: {
					offset: 1,
					limit: 10
				}
			};

			listingRepositoryMock.findAll.mockResolvedValueOnce([
				{
					id: 1,
					listing: Listing.create({
						title: 'Test',
						images: ['image1.jpg'],
						createdById: 1
					})
				}
			]);

			const result = await listingService.findListings(params);

			expect(listingRepositoryMock.findAll).toHaveBeenCalledWith({
				filters: {
					title: 'Test'
				},
				sort: {
					field: ListingSortableFields.CREATED_AT,
					direction: SortDirection.DESC
				},
				pagination: {
					offset: 1,
					limit: 10
				}
			});
			expect(result).toEqual([
				{
					id: 1,
					listing: expect.objectContaining({
						title: 'Test',
						images: ['image1.jpg']
					})
				}
			]);
		});
	});

	describe('Reconcile Images', () => {
		it('should reconcile images successfully', async () => {
			const listingId = 1;
			const newImages = ['image2.jpg', 'image3.jpg'];
			const performedById = 1;

			listingRepositoryMock.getById.mockResolvedValueOnce({
				id: listingId,
				listing: Listing.create({
					title: 'Test Listing',
					images: ['image1.jpg'],
					createdById: 1
				})
			});

			await listingService.reconcileImages(listingId, newImages, performedById);

			expect(listingRepositoryMock.getById).toHaveBeenCalledWith(listingId);

			expect(listingRepositoryMock.update).toHaveBeenCalledWith(
				listingId,
				expect.objectContaining({
					images: newImages
				})
			);
		});
	});
});
