import type { DbClient, PaginationOptions, SortOptions } from '$lib/server/prisma/prisma.types';
import type { User } from '../users/user.domain';
import type { Building, ConstructionType } from './building.domain';

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
};

export type BuildingQueryOptions = {
	filters?: BuildingFilterOptions;
	sort?: SortOptions<BuildingSortableFields>;
	pagination?: PaginationOptions;
};

export interface IBuildingsRepository {
	withClient(client: DbClient): IBuildingsRepository;
	getById(id: number): Promise<Building | null>;
	findAll(options?: BuildingQueryOptions): Promise<Building[]>;
	findAllCount(filters?: BuildingFilterOptions): Promise<number>;
	create(building: Building): Promise<Building>;
	update(building: Building): Promise<Building>;
	softDelete(building: Building): Promise<void>;
	delete(building: Building): Promise<void>;
}

export type AddBuildingParams = {
	constructionType: ConstructionType;
	width: number;
	length: number;
	height: number;
	bedrooms: number;
	bathrooms: number;
	floors: number;
	veranda: boolean;
	performedBy: User;
};

export type UpdateBuildingParams = {
	targetId: number;
	performedBy: User;
	constructionType?: ConstructionType;
	width?: number;
	length?: number;
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	veranda?: boolean;
};

export type DeleteBuildingParams = {
	targetId: number;
	performedBy: User;
};

export type FindBuildingsParams = BuildingQueryOptions & {
	performedBy: User;
};

export interface IBuildingsService {
	getBuildingById(id: number): Promise<Building>;
	addBuilding(params: AddBuildingParams): Promise<Building>;
	updateBuilding(params: UpdateBuildingParams): Promise<Building>;
	deleteBuilding(params: DeleteBuildingParams): Promise<void>;
	findBuildings(params: FindBuildingsParams): Promise<Building[]>;
}
