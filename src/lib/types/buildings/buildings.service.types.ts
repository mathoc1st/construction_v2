import type { AddFinishParams, UpdateFinishParams } from '../finishes/finishes.service.types';
import type { ConstructionType } from './building.domain.types';
import type {
	BuildingQueryOptions,
	BuildingWithId,
	IBuildingsRepository
} from './buildings.repository.types';

export type AddBuildingParams = {
	constructionType: ConstructionType;
	width: number;
	length: number;
	height: number;
	bedrooms: number;
	bathrooms: number;
	floors: number;
	hasVeranda: boolean;
	finishes: AddFinishParams[];
};

export type UpdateBuildingParams = {
	constructionType?: ConstructionType;
	width?: number;
	length?: number;
	height?: number;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	hasVeranda?: boolean;
	finishes?: UpdateFinishParams[];
};

export type DeleteBuildingParams = {
	targetId: number;
	performedById: number;
};

export type FindBuildingsParams = BuildingQueryOptions;

export interface IBuildingsService {
	withRepository(repository: IBuildingsRepository): IBuildingsService;
	getBuildingById(id: number): Promise<BuildingWithId>;
	addBuilding(params: AddBuildingParams): Promise<BuildingWithId>;
	updateBuilding(params: UpdateBuildingParams): Promise<BuildingWithId>;
	deleteBuilding(params: DeleteBuildingParams): Promise<void>;
	findBuildings(params: FindBuildingsParams): Promise<BuildingWithId[]>;
}
