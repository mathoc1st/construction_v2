import { EntityNotFoundError } from '../common/errors/errors.service';
import type { User } from '../users/user.domain';
import { Building } from './building.domain';
import type {
	AddBuildingParams,
	DeleteBuildingParams,
	FindBuildingsParams,
	IBuildingsRepository,
	IBuildingsService,
	UpdateBuildingParams
} from './building.types';
import { getBuildingsRepository } from './buildings.repository';

export class BuildingsService implements IBuildingsService {
	constructor(private readonly buildingRepository: IBuildingsRepository) {}

	async getBuildingById(id: number): Promise<Building> {
		const building = await this.buildingRepository.getBuildingById(id);
		if (!building) {
			throw new EntityNotFoundError('building', id);
		}

		return building;
	}

	addBuilding(params: AddBuildingParams): Promise<Building> {
		const building = Building.create({
			...params,
			createdById: params.performedBy.id!
		});

		return this.buildingRepository.create(building);
	}

	async updateBuilding(params: UpdateBuildingParams): Promise<Building> {
		return await this.update(
			{ targetId: params.targetId, performedBy: params.performedBy },
			(building, performedBy) => {
				if (params.constructionType)
					building.changeConstructionType(params.constructionType, performedBy.id!);
				if (params.width) building.changeWidth(params.width, performedBy.id!);
				if (params.length) building.changeLength(params.length, performedBy.id!);
				if (params.height) building.changeHeight(params.height, performedBy.id!);
				if (params.bedrooms) building.changeBedrooms(params.bedrooms, performedBy.id!);
				if (params.bathrooms) building.changeBathrooms(params.bathrooms, performedBy.id!);
				if (params.floors) building.changeFloors(params.floors, performedBy.id!);
			}
		);
	}

	async deleteBuilding(params: DeleteBuildingParams): Promise<void> {
		const targetBuilding = await this.buildingRepository.getBuildingById(params.targetId);

		if (!targetBuilding) {
			throw new EntityNotFoundError('building', params.targetId);
		}

		targetBuilding.markDeleted(params.performedBy.id!);

		return await this.buildingRepository.softDelete(targetBuilding);
	}

	findBuildings(params: FindBuildingsParams): Promise<Building[]> {
		const { filters, sort, pagination } = params;

		return this.buildingRepository.findAll({ filters, sort, pagination });
	}

	private async update(
		params: { targetId: number; performedBy: User },
		updater: (building: Building, performedBy: User) => Promise<void> | void
	): Promise<Building> {
		const targetBuilding = await this.buildingRepository.getBuildingById(params.targetId);
		if (!targetBuilding) {
			throw new EntityNotFoundError('building', params.targetId);
		}

		await updater(targetBuilding, params.performedBy);

		const updatedBuilding = await this.buildingRepository.update(targetBuilding);

		return updatedBuilding;
	}
}

let buildingService: IBuildingsService | null = null;

export const getBuildingsService = () => {
	if (!buildingService) {
		buildingService = new BuildingsService(getBuildingsRepository());
	}
	return buildingService;
};
