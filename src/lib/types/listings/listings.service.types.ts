import type { ImageId } from '$lib/server/api/images/image.domain';
import type { Listing, ListingId } from '$lib/server/api/listings/listing.domain';
import type { UserId } from '$lib/server/api/users/user.domain';
import type { AddBuildingParams, UpdateBuildingParams } from '../buildings/buildings.service.types';
import type { ListingQueryOptions } from './listings.repository.types';

export type AddImageParams = {
	id: ImageId;
	folder: string;
	bucket: string;
	key: string;
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
}
