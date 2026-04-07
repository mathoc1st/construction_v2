import type { Building } from '$lib/server/api/buildings/building.domain';
import type { Finish } from '$lib/server/api/finishes/finish.domain';
import type { Listing } from '$lib/server/api/listings/listing.domain';
import type { ConstructionType } from '../buildings/building.domain.types';
import type { DbClient, PaginationOptions, SortOptions } from '../prisma/prisma.service.types';

export type ListingWithId = {
	id: number;
	listing: Listing;
};

export type ListingWithRelations = {
	listing: {
		id: number;
		record: Listing;
	};
	building: {
		id: number;
		record: Building;
	} | null;
	finishes: {
		id: number;
		record: Finish;
	}[];
};

export enum ListingSortableFields {
	VIEWS = 'views',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt'
}

export type ListingFilterOptions = {
	title?: string;
	includesDeleted?: boolean;
};

export type ListingQueryOptions = {
	filters?: ListingFilterOptions;
	sort?: SortOptions<ListingSortableFields>;
	pagination?: PaginationOptions;
};

export type ListingWithBuildingAndFinishes = {
	listing: Listing;
	building: Building;
	finishes: Finish[];
};

export interface IListingsRepository {
	withClient(client: DbClient): IListingsRepository;
	getListingById(id: number): Promise<ListingWithId | null>;
	getListingByIdWithRelations(id: number): Promise<ListingWithRelations | null>;
	findAll(options?: ListingQueryOptions): Promise<ListingWithId[]>;
	create(buildingId: number, listing: Listing): Promise<ListingWithId>;
	createListingWithRelations(
		listing: Listing,
		building: Building,
		finishes: Finish[]
	): Promise<ListingWithRelations>;

	update(id: number, listing: Listing): Promise<ListingWithId>;
	delete(id: number): Promise<void>;
	getBuildingIdByListingId(id: number): Promise<number | null>;
	findListingsByBuildingType(
		type: ConstructionType,
		options?: ListingQueryOptions
	): Promise<ListingWithRelations[]>;
}
