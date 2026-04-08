import type { IImagesRepository } from '$lib/types/images/images.repository';
import type { IPrismaService } from '$lib/types/prisma/prisma.service.types';
import { getPrismaService, PrismaService } from '../prisma/prisma.service';
import type { Image, ImageId } from './image.domain';
import { ImageMapper } from './image.mapper';
import { ImageStatus as DomainImageStatus } from '$lib/types/images/image.domain.types';
import { ImageStatus as PrismaImageStatus } from '../prisma/generated/client';

const imageStatusPrismaMap: Record<PrismaImageStatus, DomainImageStatus> = {
	TEMP: DomainImageStatus.TEMP,
	ACTIVE: DomainImageStatus.ACTIVE,
	DELETED: DomainImageStatus.DELETED
};

export class ImagesRepository implements IImagesRepository {
	constructor(private readonly _prismaService: IPrismaService) {}

	async addMany(images: Image[]): Promise<number> {
		const result = await PrismaService.executeOrThrow(() =>
			this._prismaService.client.image.createMany({
				data: images.map((image) => ImageMapper.toPersistenceFromDomain(image))
			})
		);

		return result.count;
	}

	async updateImagesStatusAndFolder(
		ids: ImageId[],
		status: string,
		folder: string
	): Promise<number> {
		const result = await PrismaService.executeOrThrow(() =>
			this._prismaService.client.image.updateMany({
				where: {
					id: { in: ids.map((id) => id.value) }
				},
				data: {
					status: imageStatusPrismaMap[status as PrismaImageStatus],
					folder: folder
				}
			})
		);

		return result.count;
	}

	async findManyByIds(ids: ImageId[]): Promise<Image[]> {
		const result = await PrismaService.executeOrThrow(() =>
			this._prismaService.client.image.findMany({
				where: {
					id: { in: ids.map((id) => id.value) }
				}
			})
		);

		return result.map((image) =>
			ImageMapper.toDomainFromPersistence({
				...image,
				status: imageStatusPrismaMap[image.status as PrismaImageStatus]
			})
		);
	}

	async deleteMany(ids: ImageId[]): Promise<void> {
		await PrismaService.executeOrThrow(() =>
			this._prismaService.client.image.deleteMany({
				where: {
					id: { in: ids.map((id) => id.value) }
				}
			})
		);
	}
}

let _imagesRepositoryInstance: ImagesRepository | null = null;

export function getImagesRepository(): ImagesRepository {
	if (!_imagesRepositoryInstance) {
		_imagesRepositoryInstance = new ImagesRepository(getPrismaService());
	}
	return _imagesRepositoryInstance;
}
