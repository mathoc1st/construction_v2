import type { Image } from '$lib/server/api/images/image.domain';
import type { ListingId } from '$lib/server/api/listings/listing.domain';
import type { UserId } from '$lib/server/api/users/user.domain';
import type { UpdateImageParams } from '../listings/listings.service.types';

export interface IImagesService {
	uploadImages(
		imageFiles: { file: File; order: number }[],
		uploadedBy: UserId,
		listingId?: ListingId | null
	): Promise<Image[]>;
	finalizeImages(images: UpdateImageParams[], updatedBy: UserId): Promise<Image[]>;
	deleteImages(images: UpdateImageParams[], deletedBy: UserId): Promise<Image[]>;
	getImageUrl(image: Image): Promise<string | null>;
}
