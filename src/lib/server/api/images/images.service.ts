import { ImageStatus } from '$lib/types/images/image.domain.types';
import type { IImagesRepository } from '$lib/types/images/images.repository';
import type { IImagesService } from '$lib/types/images/images.service.types';
import type { UpdateImageParams } from '$lib/types/listings/listings.service.types';
import type { IMinioService } from '$lib/types/minio/minio.service.types';
import { getMinioService } from '../minio/minio.service';
import type { UserId } from '../users/user.domain';
import { ACTIVE_IMAGE_FOLDER, Image, IMAGE_BUCKET_NAME, TEMP_IMAGE_FOLDER } from './image.domain';
import { getImagesRepository } from './images.repository';

export class ImageService implements IImagesService {
	constructor(
		private readonly _minioService: IMinioService,
		private readonly _imagesRepository: IImagesRepository
	) {}

	async uploadImages(images: File[], uploadedBy: UserId): Promise<Image[]> {
		const uploadedImages: Image[] = [];

		for (const file of images) {
			const key = `${crypto.randomUUID()}-${file.name}`;
			await this._minioService.uploadObject(IMAGE_BUCKET_NAME, TEMP_IMAGE_FOLDER, key, file);

			uploadedImages.push(
				Image.create({
					folder: TEMP_IMAGE_FOLDER,
					key: key,
					bucket: IMAGE_BUCKET_NAME,
					createdById: uploadedBy
				})
			);
		}

		const addedCount = await this._imagesRepository.addMany(uploadedImages, uploadedBy);

		if (addedCount !== uploadedImages.length) {
			throw new Error('Failed to save all uploaded images to the database');
		}

		return uploadedImages;
	}

	async finalizeImages(updates: UpdateImageParams[], updatedBy: UserId): Promise<Image[]> {
		const imagesToUpdate = await this._imagesRepository.findManyByIds(updates.map((u) => u.id));

		for (const image of imagesToUpdate) {
			await this._minioService.moveObject(
				IMAGE_BUCKET_NAME,
				`${image.folder}/${image.key}`,
				IMAGE_BUCKET_NAME,
				`${ACTIVE_IMAGE_FOLDER}/${image.key}`
			);

			image.markActive(updatedBy);
		}

		const updatedCount = await this._imagesRepository.updateImagesStatusAndFolder(
			updates.map((img) => img.id),
			ImageStatus.ACTIVE,
			ACTIVE_IMAGE_FOLDER
		);

		if (updatedCount !== updates.length) {
			throw new Error('Failed to update all finalized images in the database');
		}

		return imagesToUpdate;
	}

	async deleteImages(updates: UpdateImageParams[], deletedBy: UserId): Promise<Image[]> {
		const imagesToDelete = await this._imagesRepository.findManyByIds(updates.map((u) => u.id));

		for (const image of imagesToDelete) {
			await this._minioService.moveObject(
				IMAGE_BUCKET_NAME,
				`${image.folder}/${image.key}`,
				IMAGE_BUCKET_NAME,
				`deleted/${image.key}`
			);

			image.markDeleted(deletedBy);
		}

		const updatedCount = await this._imagesRepository.updateImagesStatusAndFolder(
			updates.map((img) => img.id),
			ImageStatus.DELETED,
			`deleted`
		);

		if (updatedCount !== updates.length) {
			throw new Error('Failed to update all finalized images in the database');
		}

		return imagesToDelete;
	}
}

let _imageServiceInstance: ImageService | null = null;

export function getImageService(): ImageService {
	if (!_imageServiceInstance) {
		_imageServiceInstance = new ImageService(getMinioService(), getImagesRepository());
	}

	return _imageServiceInstance;
}
