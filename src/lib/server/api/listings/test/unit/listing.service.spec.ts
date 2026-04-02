import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { ListingsService } from '../../listings.service';
import {
	ListingSortableFields,
	type AddListingParams,
	type addListingWithBuildingAndFinishesParams,
	type DeleteListingParams,
	type FindListingsParams,
	type IListingsRepository,
	type IListingsService,
	type UpdateListingParams
} from '../../listing.types';
import { User } from '$lib/server/api/users/user.domain';
import { Listing } from '../../listing.domain';
import { SortDirection, type IPrismaService } from '$lib/server/prisma/prisma.types';
import { FinishType, type IFinishesRepository } from '$lib/server/api/finishes/finish.types';
import type { IBuildingsRepository } from '$lib/server/api/buildings/building.types';
import { Building, ConstructionType } from '$lib/server/api/buildings/building.domain';
import { Finish } from '$lib/server/api/finishes/finish.domain';

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

	const mockBuildingRepo = {
		create: vi.fn()
	};

	const mockFinishRepo = {
		create: vi.fn()
	};

	const mockListingRepo = {
		create: vi.fn()
	};

	const listingRepositoryMock: Mocked<IListingsRepository> = {
		getListingById: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		delete: vi.fn(),
		withClient: vi.fn(() => mockListingRepo as unknown as IListingsRepository)
	};

	const buildingRepositoryMock: Mocked<IBuildingsRepository> = {
		getById: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		findAllCount: vi.fn(),
		softDelete: vi.fn(),
		withClient: vi.fn(() => mockBuildingRepo as unknown as IBuildingsRepository)
	};

	const finishRepositoryMock: Mocked<IFinishesRepository> = {
		getById: vi.fn(),
		findAllCount: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		withClient: vi.fn(() => mockFinishRepo as unknown as IFinishesRepository)
	};

	const listingService: IListingsService = new ListingsService(
		prismaServiceMock,
		listingRepositoryMock,
		buildingRepositoryMock,
		finishRepositoryMock
	);

	const mockUser: User = User.fromPersistence({
		id: 1,
		username: 'testuser',
		passwordHash: 'hashedpassword',
		createdAt: new Date(),
		updatedAt: new Date()
	});

	let listing: Listing;

	beforeEach(() => {
		listing = Listing.fromPersistence({
			title: 'Test Listing',
			images: ['image1.jpg'],
			buildingId: 1,
			createdById: mockUser.id!,
			updatedAt: new Date(),
			createdAt: new Date(),
			deletedAt: null,
			updatedById: mockUser.id!,
			deletedById: null,
			id: 1,
			views: 0
		});

		vi.clearAllMocks();
	});

	describe('Add Listing', () => {
		it('should add a listing successfully', async () => {
			const params: AddListingParams = {
				performedBy: mockUser,
				title: 'Test Listing',
				images: ['image1.jpg'],
				buildingId: 1
			};

			listingRepositoryMock.create.mockResolvedValueOnce(
				Listing.create({ ...params, createdById: mockUser.id! })
			);

			const result = await listingService.addListing(params);

			expect(result).toEqual(
				expect.objectContaining({
					title: 'Test Listing',
					images: ['image1.jpg'],
					buildingId: 1
				})
			);
		});
	});

	describe('Add Listing with Building and Finishes', () => {
		it('should add a listing with building and finishes successfully', async () => {
			const params: addListingWithBuildingAndFinishesParams = {
				performedBy: mockUser,
				buildingParams: {
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					veranda: false
				},
				finishesParams: [
					{
						type: FinishType.COLD,
						description: 'Cold finish',
						price: 1000
					}
				],
				listingParams: {
					title: 'Test Listing',
					images: ['image1.jpg']
				}
			};

			mockBuildingRepo.create.mockResolvedValueOnce(
				Building.fromPersistence({
					...params.buildingParams,
					createdById: mockUser.id!,
					id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
					updatedById: mockUser.id!,
					deletedById: null
				})
			);

			mockFinishRepo.create.mockResolvedValueOnce(
				Finish.fromPersistence({
					...params.finishesParams[0],
					buildingId: 1,
					createdById: mockUser.id!,
					originalPrice: null,
					id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
					updatedById: mockUser.id!,
					deletedById: null
				})
			);

			mockListingRepo.create.mockResolvedValueOnce(
				Listing.fromPersistence({
					...params.listingParams,
					buildingId: 1,
					createdById: mockUser.id!,
					id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
					updatedById: mockUser.id!,
					deletedById: null,
					views: 0
				})
			);

			const result = await listingService.addListingWithBuildingAndFinishes(params);

			expect(result.listing).toEqual(
				expect.objectContaining({
					title: 'Test Listing',
					images: ['image1.jpg'],
					buildingId: 1
				})
			);
			expect(result.building).toEqual(
				expect.objectContaining({
					constructionType: ConstructionType.BARN,
					width: 10,
					length: 20,
					height: 5,
					bedrooms: 2,
					bathrooms: 1,
					floors: 1,
					veranda: false
				})
			);
			expect(result.finishes).toEqual([
				expect.objectContaining({
					type: FinishType.COLD,
					description: 'Cold finish',
					price: 1000,
					buildingId: 1
				})
			]);
		});
	});

	describe('Update Listing', () => {
		it('should update a listing successfully', async () => {
			const params: UpdateListingParams = {
				targetId: 1,
				performedBy: mockUser,
				title: 'Updated Title',
				images: ['updated_image.jpg']
			};

			listingRepositoryMock.getListingById.mockResolvedValueOnce(listing);
			listingRepositoryMock.update.mockResolvedValueOnce(
				Listing.create({
					...listing,
					title: 'Updated Title',
					images: ['updated_image.jpg'],
					buildingId: 1,
					createdById: mockUser.id!
				})
			);

			const result = await listingService.updateListing(params);

			expect(result).toEqual(
				expect.objectContaining({
					title: 'Updated Title',
					images: ['updated_image.jpg']
				})
			);
		});
	});

	describe('Delete Listing', () => {
		it('should delete a listing successfully', async () => {
			const params: DeleteListingParams = {
				targetId: 1,
				performedBy: mockUser
			};

			listingRepositoryMock.getListingById.mockResolvedValueOnce(listing);

			await listingService.deleteListing(params);

			expect(listingRepositoryMock.softDelete).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Test Listing',
					images: ['image1.jpg'],
					buildingId: 1,
					deletedAt: expect.any(Date),
					deletedById: mockUser.id
				})
			);
		});
	});

	describe('Find Listings', () => {
		it('should find listings successfully', async () => {
			const params: FindListingsParams = {
				performedBy: mockUser,
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

			listingRepositoryMock.findAll.mockResolvedValueOnce([listing]);

			const result = await listingService.findListings(params);

			expect(result).toEqual([listing]);
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
			expect(result[0]).toEqual(listing);
		});
	});
});
