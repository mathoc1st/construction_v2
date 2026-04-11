import type { Building } from '$lib/server/api/buildings/building.domain';
import type { Finish } from '$lib/server/api/finishes/finish.domain';
import type { Image } from '$lib/server/api/images/image.domain';
import type { Listing, ListingId } from '$lib/server/api/listings/listing.domain';
import type { ConstructionType } from '../buildings/building.domain.types';
import type { FinishType } from '../finishes/finish.domain.types';
import type { PaginationOptions, SortOptions } from '../prisma/prisma.service.types';

export enum FinishSortableFields {
	TYPE = 'type',
	PRICE = 'price',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETED_AT = 'deletedAt'
}

export type FinishFilterOptions = {
	type?: FinishType[];
	price_from?: number;
	price_to?: number;
	description?: string;
	buildingId?: number;
	includesDeleted?: boolean;
};

export enum BuildingSortableFields {
	CONSTRUCTION_TYPE = 'constructionType',
	WIDTH = 'width',
	LENGTH = 'length',
	HEIGHT = 'height',
	FLOORS = 'floors',
	BEDROOMS = 'bedrooms',
	BATHROOMS = 'bathrooms',
	HAS_VERANDA = 'hasVeranda',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETED_AT = 'deletedAt'
}

export type BuildingFilterOptions = {
	constructionType?: ConstructionType;
	dimensions?: {
		width: number;
		length: number;
	}[];
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number[];
	hasVeranda?: boolean | null;
	includesDeleted?: boolean;
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

type ListingSort = {
	type: 'listing';
	sort?: SortOptions<ListingSortableFields>;
};

type BuildingSort = {
	type: 'building';
	sort?: SortOptions<BuildingSortableFields>;
};

type FinishSort = {
	type: 'finish';
	sort?: SortOptions<FinishSortableFields>;
};

export type SortOptionsUnion = ListingSort | BuildingSort | FinishSort;
export type FilterOptions = {
	listing?: ListingFilterOptions;
	building?: BuildingFilterOptions;
	finish?: FinishFilterOptions;
};

export type SortOptionsV2 = {
	views?: 'asc' | 'desc';
	price?: 'asc' | 'desc';
};

export type ListingQueryOptions = {
	filters?: FilterOptions;
	sort?: SortOptionsV2;
	pagination?: PaginationOptions;
};

export type ListingWithBuildingAndFinishes = {
	listing: Listing;
	building: Building;
	finishes: Finish[];
};

export type AllBuildingDetails = {
	dimensions: {
		width: number;
		length: number;
	}[];
	floors: number[];
	bedrooms: number[];
	bathrooms: number[];
	finishTypes: FinishType[];
};

export interface IListingsRepository {
	create(listing: Listing): Promise<Listing>;
	getById(id: ListingId): Promise<Listing | null>;
	save(listing: Listing, newImages: Image[]): Promise<Listing>;
	delete(id: ListingId): Promise<void>;
	find(options?: ListingQueryOptions): Promise<Listing[]>;
	findCount(options?: ListingQueryOptions): Promise<number>;
	findAllBuildingDetailsByType(type: ConstructionType): Promise<AllBuildingDetails>;
	getBuildingsByTypeCount(type: ConstructionType): Promise<number>;
}
