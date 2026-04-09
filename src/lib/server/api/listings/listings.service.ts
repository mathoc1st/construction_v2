import { Listing, ListingId } from './listing.domain';
import type {
	AddListingParams,
	IListingsService,
	UpdateImageParams,
	UpdateListingParams
} from '$lib/types/listings/listings.service.types';
import type {
	AllBuildingDetailsWithTypes,
	IListingsRepository,
	ListingQueryOptions
} from '$lib/types/listings/listings.repository.types';
import type { UserId } from '../users/user.domain';
import { Building } from '../buildings/building.domain';
import { Finish } from '../finishes/finish.domain';
import { getPrismaService } from '../prisma/prisma.service';
import { getListingsRepository } from './listings.repository';
import type { IImagesService } from '$lib/types/images/images.service.types';
import type { Image } from '../images/image.domain';
import { getImageService } from '../images/images.service';
import type { ConstructionType } from '$lib/types/buildings/building.domain.types';

export class ListingsService implements IListingsService {
	constructor(
		private readonly _listingRepository: IListingsRepository,
		private readonly _imageService: IImagesService
	) {}

	async getById(id: ListingId): Promise<Listing> {
		const listing = await this._listingRepository.getById(id);

		if (!listing) {
			throw new Error(`Listing with id ${id.value} not found`);
		}

		return listing;
	}

	async add(params: AddListingParams, performedById: UserId): Promise<Listing> {
		const finalizedImages = await this._imageService.finalizeImages(params.images, performedById);

		const listing = Listing.create({
			building: Building.create({
				constructionType: params.building.constructionType,
				width: params.building.width,
				length: params.building.length,
				height: params.building.height,
				bedrooms: params.building.bedrooms,
				bathrooms: params.building.bathrooms,
				floors: params.building.floors,
				hasVeranda: params.building.hasVeranda,
				createdById: performedById,
				finishes: params.building.finishes.map((f) =>
					Finish.create({
						type: f.type,
						description: f.description,
						price: f.price,
						originalPrice: f.originalPrice,
						createdById: performedById
					})
				)
			}),
			title: params.title,
			images: finalizedImages,
			createdById: performedById
		});

		return await this._listingRepository.create(listing);
	}

	async update(id: ListingId, updatedById: UserId, params: UpdateListingParams): Promise<Listing> {
		const listing = await this._listingRepository.getById(id);

		if (!listing) {
			throw new Error(`Listing with id ${id.value} not found`);
		}

		const newImages = await this.reconcileImages(listing, params.images);

		listing.update(params, updatedById);

		return await this._listingRepository.save(listing, newImages);
	}

	async softDelete(id: ListingId, deletedById: UserId): Promise<void> {
		const listing = await this._listingRepository.getById(id);

		if (!listing) {
			throw new Error(`Listing with id ${id.value} not found`);
		}

		listing.markDeleted(deletedById);
		await this._listingRepository.save(listing, []);
	}

	async delete(id: ListingId): Promise<void> {
		await this._listingRepository.delete(id);
	}

	async reconcileImages(listing: Listing, updates: UpdateImageParams[]): Promise<Image[]> {
		const existingImageIds = new Set(listing.images.map((img) => img.id.value));
		const newImageIds = new Set(updates.map((img) => img.id.value));

		const toAdd = updates.filter((img) => !existingImageIds.has(img.id.value));
		const addedImages = await this._imageService.finalizeImages(toAdd, listing.updatedById);

		const toDelete = listing.images.filter((img) => !newImageIds.has(img.id.value));
		await this._imageService.deleteImages(toDelete, listing.updatedById);

		return addedImages;
	}

	async find(options?: ListingQueryOptions): Promise<Listing[]> {
		return await this._listingRepository.find(options);
	}

	async findAllBuildingDetailsByType(type: ConstructionType): Promise<AllBuildingDetailsWithTypes> {
		const details = await this._listingRepository.getAllBuildingDetailsByType(type);
		const types = await this._listingRepository.getAllFinishTypesByType(type);

		return {
			details,
			types
		};
	}

	async getBuildingsByTypeCount(type: ConstructionType): Promise<number> {
		return await this._listingRepository.getBuildingsByTypeCount(type);
	}
}

let listingsService: IListingsService | null = null;

export const getListingsService = () => {
	const prismaService = getPrismaService();

	if (!listingsService) {
		listingsService = new ListingsService(
			getListingsRepository(prismaService.client),
			getImageService()
		);
	}
	return listingsService;
};
