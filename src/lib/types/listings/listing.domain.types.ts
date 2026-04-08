import type { BuildingPersistence } from '../buildings/building.domain.types';
import type { ImagePersistence } from '../images/image.domain.types';

export type ListingPersistence = {
	id: string;
	title: string;
	images: ImagePersistence[];
	views: number;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;

	createdById: string;
	updatedById: string;
	deletedById: string | null;

	building: BuildingPersistence;
};
