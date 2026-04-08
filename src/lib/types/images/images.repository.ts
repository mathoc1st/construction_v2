import type { Image, ImageId } from '$lib/server/api/images/image.domain';
import type { UserId } from '$lib/server/api/users/user.domain';

export interface IImagesRepository {
	addMany(images: Image[], createdById: UserId): Promise<number>;
	updateImagesStatusAndFolder(ids: ImageId[], status: string, folder: string): Promise<number>;
	deleteMany(ids: ImageId[]): Promise<void>;
	findManyByIds(ids: ImageId[]): Promise<Image[]>;
}
