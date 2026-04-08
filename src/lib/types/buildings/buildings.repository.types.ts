import type { Building, BuildingId } from '$lib/server/api/buildings/building.domain';
import type { DbClient, PaginationOptions, SortOptions } from '../prisma/prisma.service.types';
import type { ConstructionType } from './building.domain.types';

export type BuildingWithId = {
	id: number;
	building: Building;
};

export enum BuildingSortableFields {
	CONSTRUCTION_TYPE = 'constructionType',
	WIDTH = 'width',
	LENGTH = 'length',
	HEIGHT = 'height',
	FLOORS = 'floors',
	BEDROOMS = 'bedrooms',
	BATHROOMS = 'bathrooms',
	HAS_VERANDA = 'hasVeranda',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETED_AT = 'deletedAt'
}

export type BuildingFilterOptions = {
	constructionType?: ConstructionType;
	width?: number;
	length?: number;
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	hasVeranda?: boolean;
	includesDeleted?: boolean;
};

export type BuildingQueryOptions = {
	filters?: BuildingFilterOptions;
	sort?: SortOptions<BuildingSortableFields>;
	pagination?: PaginationOptions;
};

export interface IBuildingsRepository {
	withClient(client: DbClient): IBuildingsRepository;
	getById(id: BuildingId): Promise<Building | null>;
	findAll(options?: BuildingQueryOptions): Promise<Building[]>;
	findAllCount(filters?: BuildingFilterOptions): Promise<number>;
	create(listingId: string, building: Building): Promise<Building>;
	update(id: BuildingId, building: Building): Promise<Building>;
	delete(id: BuildingId): Promise<void>;
}
