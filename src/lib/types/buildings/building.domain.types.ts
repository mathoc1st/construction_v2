import type { FinishPersistence } from '../finishes/finish.domain.types';

export enum ConstructionType {
	FRAME = 'FRAME',
	BARN = 'BARN',
	CONTAINER = 'CONTAINER'
}

export type BuildingPersistence = {
	id: string;
	constructionType: ConstructionType;
	width: number;
	length: number;
	height: number;
	bedrooms: number;
	bathrooms: number;
	floors: number;
	hasVeranda: boolean;

	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;

	createdById: string;
	updatedById: string;
	deletedById: string | null;

	finishes: FinishPersistence[];
};
