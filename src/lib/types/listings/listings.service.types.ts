import type { ConstructionType } from '../buildings/building.domain.types';
import type { AddBuildingParams, UpdateBuildingParams } from '../buildings/buildings.service.types';
import type { AddFinishParams, UpdateFinishParams } from '../finishes/finishes.service.types';
import type {
	IListingsRepository,
	ListingQueryOptions,
	ListingWithId,
	ListingWithRelations
} from './listings.repository.types';

export type AddListingParams = {
	title: string;
	images: string[];
	performedById: number;
	buildingId: number;
};

export type AddListingWithRelationsParams = {
	building: Omit<AddBuildingParams, 'performedById' | 'listingId'>;
	listing: Omit<AddListingParams, 'performedById' | 'buildingId'>;
	finishes: Omit<AddFinishParams, 'performedById' | 'buildingId'>[];
	performedById: number;
};

export type UpdateListingWithRelationsParams = {
	listing: Omit<UpdateListingParams, 'performedById'>;
	building: Omit<UpdateBuildingParams, 'performedById'>;
	finishes: (Omit<UpdateFinishParams, 'performedById' | 'targetId'> & { targetId?: number })[];
	performedById: number;
};

export type UpdateListingParams = {
	targetId: number;
	performedById: number;
	title?: string;
	images?: string[];
};

export type DeleteListingParams = {
	targetId: number;
	performedById: number;
};

export type FindListingsParams = ListingQueryOptions & {
	performedById: number;
};

export interface IListingsService {
	addListingWithRelations(params: AddListingWithRelationsParams): Promise<ListingWithRelations>;
	addListing(params: AddListingParams): Promise<ListingWithId>;
	updateListingWithRelations(
		params: UpdateListingWithRelationsParams
	): Promise<ListingWithRelations>;
	withRepository(repository: IListingsRepository): IListingsService;
	getListingWithRelations(id: number): Promise<ListingWithRelations>;
	getListingById(id: number): Promise<ListingWithId>;
	updateListing(params: UpdateListingParams): Promise<ListingWithId>;
	deleteListing(params: DeleteListingParams): Promise<void>;
	findListings(params: FindListingsParams): Promise<ListingWithId[]>;
	reconcileImages(listingId: number, newImages: string[], performedById: number): Promise<void>;
	findListingsByBuildingType(
		type: ConstructionType,
		options?: ListingQueryOptions
	): Promise<ListingWithRelations[]>;
}
