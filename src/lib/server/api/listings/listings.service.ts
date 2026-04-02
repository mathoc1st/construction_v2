import type { IPrismaService } from '$lib/server/prisma/prisma.types';
import { Building } from '../buildings/building.domain';
import type { IBuildingsRepository } from '../buildings/building.types';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { Finish } from '../finishes/finish.domain';
import type { IFinishesRepository } from '../finishes/finish.types';
import type { User } from '../users/user.domain';
import { Listing } from './listing.domain';
import type {
	AddListingParams,
	addListingWithBuildingAndFinishesParams,
	DeleteListingParams,
	FindListingsParams,
	IListingsRepository,
	IListingsService,
	UpdateListingParams
} from './listing.types';

export class ListingsService implements IListingsService {
	constructor(
		private readonly _prismaService: IPrismaService,
		private readonly _listingRepository: IListingsRepository,
		private readonly _buildingRepository: IBuildingsRepository,
		private readonly _finishRepository: IFinishesRepository
	) {}

	async addListingWithBuildingAndFinishes(
		params: addListingWithBuildingAndFinishesParams
	): Promise<{
		listing: Listing;
		building: Building;
		finishes: Finish[];
	}> {
		if (!params.performedBy.id) throw new Error('performedBy user must have an id');

		return await this._prismaService.transaction(async (tx) => {
			const buildingRepo = this._buildingRepository.withClient(tx);
			const finishRepo = this._finishRepository.withClient(tx);
			const listingRepo = this._listingRepository.withClient(tx);

			const newBuilding = Building.create({
				...params.buildingParams,
				createdById: params.performedBy.id!
			});

			const createdBuilding = await buildingRepo.create(newBuilding);

			const newFinishes = params.finishesParams.map((finishParam) =>
				Finish.create({
					...finishParam,
					buildingId: createdBuilding.id!,
					createdById: params.performedBy.id!
				})
			);

			const createdFinishes: Finish[] = [];

			for (const finish of newFinishes) {
				const createdFinish = await finishRepo.create(finish);
				createdFinishes.push(createdFinish);
			}

			const newListing = Listing.create({
				...params.listingParams,
				buildingId: createdBuilding.id!,
				createdById: params.performedBy.id!
			});

			const createdListing = await listingRepo.create(newListing);

			return { listing: createdListing, building: createdBuilding, finishes: createdFinishes };
		});
	}

	async addListing(params: AddListingParams): Promise<Listing> {
		const listing = Listing.create({ ...params, createdById: params.performedBy.id! });

		const createdListing = await this._listingRepository.create(listing);

		return createdListing;
	}

	async updateListing(params: UpdateListingParams): Promise<Listing> {
		return await this.update(
			{ targetId: params.targetId, performedBy: params.performedBy },
			(listing, performedBy) => {
				if (params.title) listing.changeTitle(params.title, performedBy.id!);
				if (params.images && params.images.length > 0)
					listing.changeImages(params.images, performedBy.id!);
			}
		);
	}

	async deleteListing(params: DeleteListingParams): Promise<void> {
		const targetListing = await this._listingRepository.getListingById(params.targetId);

		if (!targetListing) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		targetListing.markDeleted(params.performedBy.id!);

		await this._listingRepository.softDelete(targetListing);
	}

	async findListings(params: FindListingsParams): Promise<Listing[]> {
		const { filters, sort, pagination } = params;

		return await this._listingRepository.findAll({
			filters,
			sort,
			pagination
		});
	}

	private async update(
		params: { targetId: number; performedBy: User },
		updater: (listing: Listing, performedBy: User) => Promise<void> | void
	): Promise<Listing> {
		const targetListing = await this._listingRepository.getListingById(params.targetId);
		if (!targetListing) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		await updater(targetListing, params.performedBy);

		const updatedListing = await this._listingRepository.update(targetListing);

		return updatedListing;
	}
}
