import type { DbClient, PaginationOptions, SortOptions } from '$lib/server/prisma/prisma.types';
import type { Building } from '../buildings/building.domain';
import type { AddBuildingParams } from '../buildings/building.types';
import type { Finish } from '../finishes/finish.domain';
import type { AddFinishParams } from '../finishes/finish.types';
import type { User } from '../users/user.domain';
import type { Listing } from './listing.domain';

export enum ListingSortableFields {
	VIEWS = 'views',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt'
}

export type ListingFilterOptions = {
	title?: string;
};

export type ListingQueryOptions = {
	filters?: ListingFilterOptions;
	sort?: SortOptions<ListingSortableFields>;
	pagination?: PaginationOptions;
};

export interface IListingsRepository {
	withClient(client: DbClient): IListingsRepository;
	getListingById(id: number): Promise<Listing | null>;
	findAll(options?: ListingQueryOptions): Promise<Listing[]>;
	create(listing: Listing): Promise<Listing>;
	update(listing: Listing): Promise<Listing>;
	softDelete(listing: Listing): Promise<void>;
	delete(listing: Listing): Promise<void>;
}

export type AddListingParams = {
	performedBy: User;
	title: string;
	images: string[];
	buildingId: number;
};

export type addListingWithBuildingAndFinishesParams = {
	listingParams: Omit<AddListingParams, 'buildingId' | 'performedBy'>;
	buildingParams: Omit<AddBuildingParams, 'performedBy'>;
	finishesParams: Omit<AddFinishParams, 'buildingId' | 'performedBy'>[];
	performedBy: User;
};

export type UpdateListingParams = {
	targetId: number;
	performedBy: User;
	title?: string;
	images?: string[];
};

export type DeleteListingParams = {
	targetId: number;
	performedBy: User;
};

export type FindListingsParams = ListingQueryOptions & {
	performedBy: User;
};

export interface IListingsService {
	addListingWithBuildingAndFinishes(params: addListingWithBuildingAndFinishesParams): Promise<{
		listing: Listing;
		building: Building;
		finishes: Finish[];
	}>;
	addListing(params: AddListingParams): Promise<Listing>;
	updateListing(params: UpdateListingParams): Promise<Listing>;
	deleteListing(params: DeleteListingParams): Promise<void>;
	findListings(params: FindListingsParams): Promise<Listing[]>;
}
