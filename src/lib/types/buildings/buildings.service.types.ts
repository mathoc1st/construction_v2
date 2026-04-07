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
	veranda: boolean;
	performedById: number;
	listingId: number;
};

export type UpdateBuildingParams = {
	targetId: number;
	performedById: number;
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
