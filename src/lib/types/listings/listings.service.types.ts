import type { FinishId } from '$lib/server/api/finishes/finish.domain';
import type { ImageId } from '$lib/server/api/images/image.domain';
import type { Listing, ListingId } from '$lib/server/api/listings/listing.domain';
import type { UserId } from '$lib/server/api/users/user.domain';
import type { ConstructionType } from '../buildings/building.domain.types';
import type { FinishType } from '../finishes/finish.domain.types';
import type { AllBuildingDetails, ListingQueryOptions } from './listings.repository.types';

export type AddFinishParams = {
	type: FinishType;
	description: string;
	price: number;
	originalPrice?: number | null;
};

export type UpdateFinishParams = {
	id?: FinishId;
	type: FinishType;
	description?: string;
	price?: number;
	originalPrice?: number | null;
};

export type ReconcileFinishParams = {
	finishes: (Omit<UpdateFinishParams, 'performedById' | 'targetId'> & {
		targetId?: number;
	})[];
	buildingId: number;
	performedById: number;
};

export type DeleteFinishParams = {
	targetId: number;
	performedById: number;
};

export type AddBuildingParams = {
	constructionType: ConstructionType;
	width: number;
	length: number;
	height: number;
	bedrooms: number;
	bathrooms: number;
	floors: number;
	hasVeranda: boolean;
	finishes: AddFinishParams[];
};

export type UpdateBuildingParams = {
	constructionType?: ConstructionType;
	width?: number;
	length?: number;
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	hasVeranda?: boolean;
	finishes?: UpdateFinishParams[];
};

export type DeleteBuildingParams = {
	targetId: number;
	performedById: number;
};

export type AddImageParams = {
	id: ImageId;
	order?: number;
};

export type UpdateImageParams = AddImageParams;

export type AddListingParams = {
	title: string;
	images: AddImageParams[];
	building: AddBuildingParams;
};

export type UpdateListingParams = {
	title?: string;
	images: UpdateImageParams[];
	building?: UpdateBuildingParams;
};

export type DeleteListingParams = {
	id: number;
	performedById: number;
};

export type FindListingsParams = ListingQueryOptions & {
	performedById: number;
};

export interface IListingsService {
	update(id: ListingId, updatedById: UserId, params: UpdateListingParams): Promise<Listing>;
	add(params: AddListingParams, performedById: UserId): Promise<Listing>;
	getById(id: ListingId): Promise<Listing>;
	delete(id: ListingId): Promise<void>;
	find(options?: ListingQueryOptions): Promise<Listing[]>;
	findCount(options?: ListingQueryOptions): Promise<number>;
	findAllBuildingDetailsByType(type: ConstructionType): Promise<AllBuildingDetails>;
	getBuildingsByTypeCount(type: ConstructionType): Promise<number>;
	softDelete(id: ListingId, deletedById: UserId): Promise<void>;
}
