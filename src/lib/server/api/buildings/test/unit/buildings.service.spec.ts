import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import {
	BuildingSortableFields,
	type AddBuildingParams,
	type DeleteBuildingParams,
	type FindBuildingsParams,
	type IBuildingsRepository,
	type UpdateBuildingParams
} from '../../building.types';
import { BuildingsService } from '../../buildings.service';
import { Building, ConstructionType } from '../../building.domain';
import { User } from '$lib/server/api/users/user.domain';
import { SortDirection } from '$lib/server/prisma/prisma.types';

describe('Building Service Unit', () => {
	const buildingRepositoryMock: Mocked<IBuildingsRepository> = {
		create: vi.fn(),
		getById: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		delete: vi.fn(),
		findAll: vi.fn(),
		findAllCount: vi.fn(),
		withClient: vi.fn()
	};

	const buildingService = new BuildingsService(buildingRepositoryMock);

	let building: Building;

	beforeEach(() => {
		building = Building.fromPersistence({
			id: 1,
			constructionType: ConstructionType.BARN,
			width: 10,
			length: 20,
			height: 15,
			bedrooms: 2,
			bathrooms: 1,
			floors: 1,
			veranda: false,
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
				veranda: false,
				performedBy: User.create({ username: 'testuser', passwordHash: 'hashedpassword' })
			};

			const expectedBuilding = Building.create({
				...params,
				createdById: params.performedBy.id!
			});

			buildingRepositoryMock.create.mockResolvedValueOnce(expectedBuilding);

			const result = await buildingService.addBuilding(params);

			expect(buildingRepositoryMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					constructionType: params.constructionType,
					width: params.width,
					length: params.length,
					height: params.height,
					bedrooms: params.bedrooms,
					bathrooms: params.bathrooms,
					floors: params.floors,
					veranda: params.veranda,
					createdById: params.performedBy.id
				})
			);
			expect(result).toEqual(expectedBuilding);
		});
	});

	describe('Update Building', () => {
		it('should update a building successfully', async () => {
			const params: UpdateBuildingParams = {
				targetId: 1,
				performedBy: User.create({ username: 'testuser', passwordHash: 'hashedpassword' }),
				constructionType: ConstructionType.BARN,
				width: 10,
				length: 20,
				height: 15,
				bedrooms: 2,
				bathrooms: 1,
				floors: 1,
				veranda: false
			};

			buildingRepositoryMock.getById.mockResolvedValueOnce(building);

			const updatedBuilding = Building.fromPersistence({
				id: building.id!,
				constructionType: params.constructionType!,
				width: params.width!,
				length: params.length!,
				height: params.height!,
				bedrooms: params.bedrooms!,
				bathrooms: params.bathrooms!,
				floors: params.floors!,
				veranda: params.veranda!,
				createdAt: building.createdAt,
				updatedAt: new Date(),
				deletedAt: null,
				createdById: building.createdById,
				updatedById: params.performedBy.id!,
				deletedById: null
			});

			buildingRepositoryMock.update.mockResolvedValueOnce(updatedBuilding);

			const result = await buildingService.updateBuilding(params);

			expect(buildingRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(buildingRepositoryMock.update).toHaveBeenCalledWith(
				expect.objectContaining({
					id: building.id,
					constructionType: params.constructionType,
					width: params.width,
					length: params.length,
					height: params.height,
					bedrooms: params.bedrooms,
					bathrooms: params.bathrooms,
					floors: params.floors,
					veranda: params.veranda
				})
			);
			expect(result).toEqual(updatedBuilding);
		});
	});

	describe('Delete Building', () => {
		it('should delete a building successfully', async () => {
			const params: DeleteBuildingParams = {
				targetId: 1,
				performedBy: User.create({ username: 'testuser', passwordHash: 'hashedpassword' })
			};

			buildingRepositoryMock.getById.mockResolvedValueOnce(building);
			buildingRepositoryMock.softDelete.mockResolvedValueOnce();

			await buildingService.deleteBuilding(params);

			expect(buildingRepositoryMock.getById).toHaveBeenCalledWith(params.targetId);
			expect(buildingRepositoryMock.softDelete).toHaveBeenCalledWith(
				expect.objectContaining({
					id: building.id,
					isDeleted: true,
					deletedById: params.performedBy.id
				})
			);
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
				performedBy: User.create({ username: 'testuser', passwordHash: 'hashedpassword' })
			};

			const expectedBuildings = [building];

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
			expect(result).toEqual(expectedBuildings);
		});
	});
});
