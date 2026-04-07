import { getPrismaService } from '$lib/server/api/prisma/prisma.service';
import type { IPrismaService } from '$lib/types/prisma/prisma.service.types';
import { Building } from '../buildings/building.domain';
import { getBuildingsRepository } from '../buildings/buildings.repository';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { Finish } from '../finishes/finish.domain';
import { getFinishesRepository } from '../finishes/finishes.repository';
import { Listing } from './listing.domain';
import { getListingsRepository } from './listings.repository';
import { getBuildingsService } from '../buildings/buildings.service';
import { getFinishesService } from '../finishes/finishes.service';
import type { Prisma } from '$lib/server/api/prisma/generated/client';
import { getMinioService } from '../minio/minio.service';
import type {
	AddListingParams,
	AddListingWithRelationsParams,
	DeleteListingParams,
	FindListingsParams,
	IListingsService,
	UpdateListingParams,
	UpdateListingWithRelationsParams
} from '$lib/types/listings/listings.service.types';
import type { IBuildingsService } from '$lib/types/buildings/buildings.service.types';
import type { IFinishesService } from '$lib/types/finishes/finishes.service.types';
import type { IBuildingsRepository } from '$lib/types/buildings/buildings.repository.types';
import type {
	IListingsRepository,
	ListingQueryOptions,
	ListingWithId,
	ListingWithRelations
} from '$lib/types/listings/listings.repository.types';
import type {
	FinishWithId,
	IFinishesRepository
} from '$lib/types/finishes/finishes.repository.types';
import type { IMinioService } from '$lib/types/minio/minio.service.types';
import type { ConstructionType } from '$lib/types/buildings/building.domain.types';

export class ListingsService implements IListingsService {
	constructor(
		private readonly _minioService: IMinioService,
		private readonly _prismaService: IPrismaService,
		private readonly _buildingService: IBuildingsService,
		private readonly _finishService: IFinishesService,
		private readonly _listingRepository: IListingsRepository,
		private readonly _buildingRepository: IBuildingsRepository,
		private readonly _finishRepository: IFinishesRepository
	) {}

	withRepository(repository: IListingsRepository) {
		return new ListingsService(
			this._minioService,
			this._prismaService,
			this._buildingService,
			this._finishService,
			repository,
			this._buildingRepository,
			this._finishRepository
		);
	}

	createTxContext(tx: Prisma.TransactionClient) {
		const buildingRepo = this._buildingRepository.withClient(tx);
		const finishRepo = this._finishRepository.withClient(tx);
		const listingRepo = this._listingRepository.withClient(tx);

		return {
			buildingService: this._buildingService.withRepository(buildingRepo),
			finishService: this._finishService.withRepository(finishRepo),
			listingService: this.withRepository(listingRepo)
		};
	}

	async addListing(params: AddListingParams): Promise<ListingWithId> {
		const listing = Listing.create({
			title: params.title,
			images: params.images,
			createdById: params.performedById
		});

		return await this._listingRepository.create(params.buildingId, listing);
	}

	async addListingWithRelations(
		params: AddListingWithRelationsParams
	): Promise<ListingWithRelations> {
		const result = await this._prismaService.transaction(async (tx) => {
			const result = await this._listingRepository.withClient(tx).createListingWithRelations(
				Listing.create({
					title: params.listing.title,
					images: params.listing.images,
					createdById: params.performedById
				}),
				Building.create({
					constructionType: params.building.constructionType,
					width: params.building.width,
					length: params.building.length,
					height: params.building.height,
					bedrooms: params.building.bedrooms,
					bathrooms: params.building.bathrooms,
					floors: params.building.floors,
					veranda: params.building.veranda,
					createdById: params.performedById
				}),
				params.finishes.map((f) =>
					Finish.create({
						type: f.type,
						description: f.description,
						price: f.price,
						originalPrice: f.originalPrice,
						createdById: params.performedById
					})
				)
			);

			return result;
		});

		return result;
	}

	async getListingWithRelations(id: number): Promise<ListingWithRelations> {
		const listingWithRelations = await this._listingRepository.getListingByIdWithRelations(id);

		if (!listingWithRelations) throw new EntityNotFoundError('listing', id);

		return {
			listing: listingWithRelations.listing,
			building: listingWithRelations.building,
			finishes: listingWithRelations.finishes
		};
	}

	async getListingById(id: number): Promise<ListingWithId> {
		const listing = await this._listingRepository.getListingById(id);

		if (!listing) throw new EntityNotFoundError('listing', id);

		return listing;
	}

	async updateListingWithRelations(
		params: UpdateListingWithRelationsParams
	): Promise<ListingWithRelations> {
		if (params.listing.images && params.listing.images.length > 0) {
			await this.reconcileImages(
				params.listing.targetId,
				params.listing.images,
				params.performedById
			);
		}

		return await this._prismaService.transaction(async (tx) => {
			const { buildingService, finishService, listingService } = this.createTxContext(tx);

			const updatedBuilding = await buildingService.updateBuilding({
				...params.building,
				performedById: params.performedById,
				targetId: params.building.targetId
			});

			const updatedFinishes: FinishWithId[] = await finishService.reconcileFinishes({
				finishes: params.finishes,
				buildingId: params.building.targetId,
				performedById: params.performedById
			});

			const updatedListing = await listingService.updateListing({
				...params.listing,
				performedById: params.performedById,
				targetId: params.listing.targetId
			});

			return {
				listing: {
					id: updatedListing.id,
					record: updatedListing.listing
				},
				building: {
					id: updatedBuilding.id,
					record: updatedBuilding.building
				},
				finishes: updatedFinishes.map((f) => ({
					id: f.id,
					record: f.finish
				}))
			};
		});
	}

	async reconcileImages(
		listingId: number,
		newImages: string[],
		performedById: number
	): Promise<void> {
		const listingResult = await this._listingRepository.getListingById(listingId);

		if (!listingResult) {
			throw new EntityNotFoundError('listing', listingId);
		}

		const listing = listingResult.listing;
		const oldImages = listing.images;

		const toDelete = oldImages.filter((key) => !newImages.includes(key));

		for (const key of toDelete) {
			await this._minioService.moveObject('images', key, 'images', `deleted/${key}`);
		}

		await this.updateListing({
			targetId: listingId,
			images: newImages,
			performedById: performedById
		});
	}

	async updateListing(params: UpdateListingParams): Promise<ListingWithId> {
		return await this.update(
			{ targetId: params.targetId, performedById: params.performedById },
			async (listing, performedById) => {
				if (params.title) listing.changeTitle(params.title, performedById);
				if (params.images) {
					listing.changeImages(params.images, performedById);
				}
			}
		);
	}

	async softDeleteListing(params: DeleteListingParams): Promise<ListingWithId> {
		return await this.update(
			{ targetId: params.targetId, performedById: params.performedById },
			(listing, performedById) => {
				listing.markDeleted(performedById);
			}
		);
	}

	async deleteListing(params: DeleteListingParams): Promise<void> {
		const targetListing = await this._listingRepository.getListingById(params.targetId);

		if (!targetListing) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		await this._listingRepository.delete(params.targetId);
	}

	async findListings(params: FindListingsParams): Promise<ListingWithId[]> {
		const { filters, sort, pagination } = params;

		return await this._listingRepository.findAll({
			filters,
			sort,
			pagination
		});
	}

	async findListingsByBuildingType(
		type: ConstructionType,
		options?: ListingQueryOptions
	): Promise<ListingWithRelations[]> {
		return await this._listingRepository.findListingsByBuildingType(type, options);
	}

	private async update(
		params: { targetId: number; performedById: number },
		updater: (listing: Listing, performedById: number) => Promise<void> | void
	): Promise<ListingWithId> {
		const listingWithId = await this._listingRepository.getListingById(params.targetId);
		if (!listingWithId) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		const targetListing = listingWithId.listing;

		await updater(targetListing, params.performedById);

		const updatedListing = await this._listingRepository.update(params.targetId, targetListing);

		return updatedListing;
	}
}

let listingsService: IListingsService | null = null;

export const getListingsService = () => {
	const prismaService = getPrismaService();

	if (!listingsService) {
		listingsService = new ListingsService(
			getMinioService(),
			prismaService,
			getBuildingsService(),
			getFinishesService(),
			getListingsRepository(prismaService.client),
			getBuildingsRepository(prismaService.client),
			getFinishesRepository(prismaService.client)
		);
	}
	return listingsService;
};
