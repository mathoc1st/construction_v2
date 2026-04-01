import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { ListingsService } from '../../listings.service';
import {
	ListingSortableFields,
	type AddListingParams,
	type DeleteListingParams,
	type FindListingsParams,
	type IListingsRepository,
	type IListingsService,
	type UpdateListingParams
} from '../../listing.types';
import { User } from '$lib/server/api/users/user.domain';
import { Listing } from '../../listing.domain';
import { SortDirection } from '$lib/server/prisma/prisma.types';

describe('Listing Service Unit', () => {
	const listingRepositoryMock: Mocked<IListingsRepository> = {
		getListingById: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		delete: vi.fn()
	};

	const listingService: IListingsService = new ListingsService(listingRepositoryMock);

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
