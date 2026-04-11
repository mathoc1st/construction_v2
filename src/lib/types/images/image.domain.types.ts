export enum ImageStatus {
	TEMP = 'TEMP',
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED'
}

export type ImagePersistence = {
	id: string;
	folder: string;
	key: string;
	bucket: string;
	status: ImageStatus;
	order: number;

	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;

	createdById: string;
	updatedById: string;
	deletedById: string | null;
};
