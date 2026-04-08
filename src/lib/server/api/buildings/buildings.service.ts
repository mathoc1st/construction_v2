import { getPrismaService } from '$lib/server/api/prisma/prisma.service';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { Building } from './building.domain';
import type {
	AddBuildingParams,
	DeleteBuildingParams,
	FindBuildingsParams,
	IBuildingsService,
	UpdateBuildingParams
} from '$lib/types/buildings/buildings.service.types';
import { getBuildingsRepository } from './buildings.repository';
import type {
	BuildingWithId,
	IBuildingsRepository
} from '$lib/types/buildings/buildings.repository.types';

export class BuildingsService implements IBuildingsService {
	constructor(private readonly _buildingRepository: IBuildingsRepository) {}

	withRepository(repository: IBuildingsRepository): IBuildingsService {
		return new BuildingsService(repository);
	}

	async getBuildingById(id: number): Promise<BuildingWithId> {
		const buildingWithId = await this._buildingRepository.getById(id);

		if (!buildingWithId) {
			throw new EntityNotFoundError('building', id);
		}

		return buildingWithId;
	}

	addBuilding(params: AddBuildingParams): Promise<BuildingWithId> {
		const building = Building.create({
			...params,
			createdById: params.performedById
		});

		return this._buildingRepository.create(params.listingId, building);
	}

	async updateBuilding(params: UpdateBuildingParams): Promise<BuildingWithId> {
		return await this.update(
			{ targetId: params.listingId, performedById: params.performedById },
			(building, performedById) => {
				if (params.constructionType)
					building.changeConstructionType(params.constructionType, performedById);
				if (params.width !== undefined) building.changeWidth(params.width, performedById);
				if (params.length !== undefined) building.changeLength(params.length, performedById);
				if (params.height !== undefined) building.changeHeight(params.height, performedById);
				if (params.bedrooms !== undefined) building.changeBedrooms(params.bedrooms, performedById);
				if (params.bathrooms !== undefined)
					building.changeBathrooms(params.bathrooms, performedById);
				if (params.floors !== undefined) building.changeFloors(params.floors, performedById);
			}
		);
	}

	async softDeleteBuilding(params: DeleteBuildingParams): Promise<BuildingWithId> {
		const buildingWithId = await this._buildingRepository.getById(params.targetId);

		if (!buildingWithId) {
			throw new EntityNotFoundError('building', params.targetId);
		}

		const { building } = buildingWithId;

		building.markDeleted(params.performedById);

		return await this._buildingRepository.update(params.targetId, building);
	}

	async deleteBuilding(params: DeleteBuildingParams): Promise<void> {
		const buildingWithId = await this._buildingRepository.getById(params.targetId);

		if (!buildingWithId) {
			throw new EntityNotFoundError('building', params.targetId);
		}

		await this._buildingRepository.delete(params.targetId);
	}

	async findBuildings(params: FindBuildingsParams): Promise<BuildingWithId[]> {
		const { filters, sort, pagination } = params;

		return await this._buildingRepository.findAll({ filters, sort, pagination });
	}

	private async update(
		params: { targetId: number; performedById: number },
		updater: (building: Building, performedById: number) => Promise<void> | void
	): Promise<BuildingWithId> {
		const buildingWithId = await this._buildingRepository.getById(params.targetId);
		if (!buildingWithId) {
			throw new EntityNotFoundError('building', params.targetId);
		}

		const { building } = buildingWithId;

		await updater(building, params.performedById);

		const updatedBuilding = await this._buildingRepository.update(params.targetId, building);

		return updatedBuilding;
	}
}

let buildingsService: IBuildingsService | null = null;

export const getBuildingsService = () => {
	const prismaService = getPrismaService();

	if (!buildingsService) {
		buildingsService = new BuildingsService(getBuildingsRepository(prismaService.client));
	}
	return buildingsService;
};
