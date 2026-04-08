import type { Image } from '$lib/server/api/images/image.domain';
import type { UserId } from '$lib/server/api/users/user.domain';
import type { UpdateImageParams } from '../listings/listings.service.types';

export interface IImagesService {
	uploadImages(images: File[], uploadedBy: UserId): Promise<Image[]>;
	finalizeImages(images: UpdateImageParams[], updatedBy: UserId): Promise<Image[]>;
	deleteImages(images: UpdateImageParams[], deletedBy: UserId): Promise<Image[]>;
}
