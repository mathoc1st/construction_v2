import type { Building } from '$lib/server/api/buildings/building.domain';
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
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt'
}

export type BuildingFilterOptions = {
	constructionType?: ConstructionType;
	width?: number;
	length?: number;
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	veranda?: boolean;
	includesDeleted?: boolean;
};

export type BuildingQueryOptions = {
	filters?: BuildingFilterOptions;
	sort?: SortOptions<BuildingSortableFields>;
	pagination?: PaginationOptions;
};

export interface IBuildingsRepository {
	withClient(client: DbClient): IBuildingsRepository;
	getById(id: number): Promise<BuildingWithId | null>;
	findAll(options?: BuildingQueryOptions): Promise<BuildingWithId[]>;
	findAllCount(filters?: BuildingFilterOptions): Promise<number>;
	create(listingId: number, building: Building): Promise<BuildingWithId>;
	update(id: number, building: Building): Promise<BuildingWithId>;
	delete(id: number): Promise<void>;
}
