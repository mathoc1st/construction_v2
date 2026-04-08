import type { ImagePersistence } from '$lib/types/images/image.domain.types';
import { UserId } from '../users/user.domain';
import { Image } from './image.domain';

export class ImageMapper {
	static toPersistenceFromDomain(image: Image): ImagePersistence {
		return {
			id: image.id.value,
			folder: image.folder,
			key: image.key,
			bucket: image.bucket,
			status: image.status,
			createdAt: image.createdAt,
			updatedAt: image.updatedAt,
			deletedAt: image.deletedAt,
			createdById: image.createdById.value,
			updatedById: image.updatedById.value,
			deletedById: image.deletedById?.value ?? null
		};
	}

	static toDomainFromPersistence(record: ImagePersistence): Image {
		return Image.fromPersistence({
			id: record.id,
			folder: record.folder,
			key: record.key,
			bucket: record.bucket,
			status: record.status,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
			deletedAt: record.deletedAt,
			createdById: new UserId(record.createdById),
			updatedById: new UserId(record.updatedById),
			deletedById: record.deletedById ? new UserId(record.deletedById) : null
		});
	}
}
