import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import {
	type AddBuildingParams,
	type DeleteBuildingParams,
	type FindBuildingsParams,
	type UpdateBuildingParams
} from '$lib/types/buildings/buildings.service.types';
import { BuildingsService } from '../../buildings.service';
import { Building } from '../../building.domain';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { SortDirection } from '$lib/types/prisma/prisma.service.types';
import {
	BuildingSortableFields,
	type IBuildingsRepository
} from '$lib/types/buildings/buildings.repository.types';

describe('Building Service Unit', () => {
	const buildingRepositoryMock: Mocked<IBuildingsRepository> = {
		create: vi.fn(),
		getById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		findAll: vi.fn(),
		findAllCount: vi.fn(),
		withClient: vi.fn()
	};

	const buildingService = new BuildingsService(buildingRepositoryMock);

	let building: Building;

	beforeEach(() => {
		building = Building.fromPersistence({
			constructionType: ConstructionType.BARN,
			width: 10,
			length: 20,
			height: 15,
			bedrooms: 2,
			bathrooms: 1,
			floors: 1,
			hasVeranda: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			createdById: 1,
			updatedById: 1,
			deletedById: null
		});

		vi.clearAllMocks();
	});

	describe('Add Building', () => {
		it('should add a building successfully', async () => {
			const params: AddBuildingParams = {
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 15,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				hasVeranda: false,
				performedById: 1,
				listingId: 1
			};

			const expectedBuilding = Building.create({
				...params,
				createdById: params.performedById
			});

			buildingRepositoryMock.create.mockResolvedValueOnce({
				building: expectedBuilding,
				id: 1
			});

			const result = await buildingService.addBuilding(params);

			expect(buildingRepositoryMock.create).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					constructionType: params.constructionType,
					width: params.width,
					length: params.length,
					height: params.height,
					bedrooms: params.bedrooms,
					bathrooms: params.bathrooms,
					floors: params.floors,
					veranda: params.hasVeranda
				})
			);
			expect(result).toEqual({
				building: expectedBuilding,
				id: 1
			});
		});
	});

	describe('Update Building', () => {
		it('should update a building successfully', async () => {
			const params: UpdateBuildingParams = {
				listingId: 1,
				performedById: 1,
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 15,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				hasVeranda: false
			};

			buildingRepositoryMock.getById.mockResolvedValueOnce({ building, id: 1 });

			const updatedBuilding = Building.fromPersistence({
				constructionType: params.constructionType!,
				width: params.width!,
				length: params.length!,
				height: params.height!,
				bedrooms: params.bedrooms!,
				bathrooms: params.bathrooms!,
				floors: params.floors!,
				hasVeranda: params.hasVeranda!,
				createdAt: building.createdAt,
				updatedAt: new Date(),
				deletedAt: null,
				createdById: building.createdById,
				updatedById: params.performedById,
				deletedById: null
			});

			buildingRepositoryMock.update.mockResolvedValueOnce({
				building: updatedBuilding,
				id: 1
			});

			const result = await buildingService.updateBuilding(params);

			expect(buildingRepositoryMock.getById).toHaveBeenCalledWith(params.listingId);
			expect(buildingRepositoryMock.update).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					constructionType: params.constructionType,
					width: params.width,
					length: params.length,
					height: params.height,
					bedrooms: params.bedrooms,
					bathrooms: params.bathrooms,
					floors: params.floors,
					veranda: params.hasVeranda
				})
			);
			expect(result).toEqual({
				building: updatedBuilding,
				id: 1
			});
		});
	});

	describe('Delete Building', () => {
		it('should delete a building successfully', async () => {
			const params: DeleteBuildingParams = {
				targetId: 1,
				performedById: 1
			};

			buildingRepositoryMock.getById.mockResolvedValueOnce({ building, id: 1 });

			await buildingService.deleteBuilding(params);

			expect(buildingRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
		});
	});

	describe('Find Buildings', () => {
		it('should find buildings based on criteria', async () => {
			const params: FindBuildingsParams = {
				filters: {
					constructionType: ConstructionType.BARN,
					bedrooms: 2
				},
				sort: {
					field: BuildingSortableFields.CREATED_AT,
					direction: SortDirection.DESC
				},
				pagination: {
					offset: 0,
					limit: 10
				},
				performedById: 1
			};

			const expectedBuildings = [{ building, id: 1 }];

			buildingRepositoryMock.findAll.mockResolvedValueOnce(expectedBuildings);

			const result = await buildingService.findBuildings(params);

			expect(buildingRepositoryMock.findAll).toHaveBeenCalledWith(
				expect.objectContaining({
					filters: expect.objectContaining({
						constructionType: params.filters?.constructionType,
						bedrooms: params.filters?.bedrooms
					}),
					sort: params.sort,
					pagination: params.pagination
				})
			);

			expect(result).toEqual([
				{
					building: expectedBuildings[0].building,
					id: expectedBuildings[0].id
				}
			]);
		});
	});
});
