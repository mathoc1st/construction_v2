import { EntityNotFoundError } from '../common/errors/errors.service';
import type { User } from '../users/user.domain';
import { Listing } from './listing.domain';
import type {
	AddListingParams,
	DeleteListingParams,
	FindListingsParams,
	IListingsRepository,
	IListingsService,
	UpdateListingParams
} from './listing.types';

export class ListingsService implements IListingsService {
	constructor(private readonly listingRepository: IListingsRepository) {}
	async addListing(params: AddListingParams): Promise<Listing> {
		const listing = Listing.create({ ...params, createdById: params.performedBy.id! });

		const createdListing = await this.listingRepository.create(listing);

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
		const targetListing = await this.listingRepository.getListingById(params.targetId);

		if (!targetListing) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		targetListing.markDeleted(params.performedBy.id!);

		await this.listingRepository.softDelete(targetListing);
	}

	async findListings(params: FindListingsParams): Promise<Listing[]> {
		const { filters, sort, pagination } = params;

		return await this.listingRepository.findAll({
			filters,
			sort,
			pagination
		});
	}

	private async update(
		params: { targetId: number; performedBy: User },
		updater: (listing: Listing, performedBy: User) => Promise<void> | void
	): Promise<Listing> {
		const targetListing = await this.listingRepository.getListingById(params.targetId);
		if (!targetListing) {
			throw new EntityNotFoundError('listing', params.targetId);
		}

		await updater(targetListing, params.performedBy);

		const updatedListing = await this.listingRepository.update(targetListing);

		return updatedListing;
	}
}
