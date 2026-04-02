/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BuildingsRepository } from '../../buildings.repository';
import {
	type Building as PrismaBuilding,
	ConstructionType as PrismaConstructionType
} from '$lib/server/prisma/generated/client';
import { Building, ConstructionType as DomainConstructionType } from '../../building.domain';
import {
	BuildingSortableFields,
	type BuildingFilterOptions,
	type BuildingQueryOptions
} from '../../building.types';
import { SortDirection, type DbClient, type IPrismaService } from '$lib/server/prisma/prisma.types';

const constructionTypeMap: Record<PrismaConstructionType, DomainConstructionType> = {
	FRAME: DomainConstructionType.FRAME,
	BARN: DomainConstructionType.BARN,
	CONTAINER: DomainConstructionType.CONTAINER
};

describe('Buildings Repository Unit', () => {
	const prismaMock = {
		building: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findUnique: vi.fn(),
			findMany: vi.fn(),
			count: vi.fn()
		}
	};

	const buildingsRepository = new BuildingsRepository(prismaMock as unknown as DbClient);

	const record: PrismaBuilding = {
		id: 1,
		constructionType: PrismaConstructionType.FRAME,
		width: 10,
		length: 20,
		height: 5,
		bedrooms: 3,
		bathrooms: 2,
		floors: 2,
		veranda: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		createdById: 1,
		updatedById: 1,
		deletedById: null
	};

	let building: Building;
	let newBuilding: Building;

	beforeEach(() => {
		building = Building.fromPersistence({
			...record,
			constructionType: constructionTypeMap[record.constructionType]
		});

		newBuilding = Building.create({
			constructionType: DomainConstructionType.BARN,
			width: 10,
			length: 20,
			height: 5,
			bedrooms: 3,
			bathrooms: 2,
			floors: 2,
			veranda: true,
			createdById: 1
		});

		vi.clearAllMocks();
	});

	describe('Create Building', () => {
		it('should create a building successfully', async () => {
			prismaMock.building.create.mockResolvedValue(record);

			const result = await buildingsRepository.create(building);

			const { id: _, ...expectedBuildingRecord } = record;

			expect(prismaMock.building.create).toHaveBeenCalledWith({
				data: expectedBuildingRecord
			});

			expect(result).toEqual(building);
		});
	});

	describe('Get Building By ID', () => {
		it('should return a building when found', async () => {
			prismaMock.building.findUnique.mockResolvedValue(record);

			const result = await buildingsRepository.getById(1);

			expect(prismaMock.building.findUnique).toHaveBeenCalledWith({
				where: { id: 1 }
			});

			expect(result).toEqual(building);
		});

		it('should return null when building is not found', async () => {
			prismaMock.building.findUnique.mockResolvedValue(null);

			const result = await buildingsRepository.getById(999);

			expect(prismaMock.building.findUnique).toHaveBeenCalledWith({
				where: { id: 999 }
			});

			expect(result).toBeNull();
		});
	});

	describe('Update Building', () => {
		it('should update a building successfully', async () => {
			const updatedRecord: PrismaBuilding = { ...record, bedrooms: 4 };
			prismaMock.building.update.mockResolvedValue(updatedRecord);

			const updatedBuilding = Building.fromPersistence({
				...updatedRecord,
				constructionType: constructionTypeMap[updatedRecord.constructionType]
			});

			const result = await buildingsRepository.update(updatedBuilding);

			expect(prismaMock.building.update).toHaveBeenCalledWith({
				where: { id: updatedBuilding.id },
				data: {
					constructionType: updatedBuilding.constructionType,
					width: updatedBuilding.width,
					length: updatedBuilding.length,
					height: updatedBuilding.height,
					bedrooms: updatedBuilding.bedrooms,
					bathrooms: updatedBuilding.bathrooms,
					floors: updatedBuilding.floors,
					veranda: updatedBuilding.veranda,
					createdAt: updatedBuilding.createdAt,
					updatedAt: updatedBuilding.updatedAt,
					deletedAt: updatedBuilding.deletedAt,
					createdById: updatedBuilding.createdById,
					updatedById: updatedBuilding.updatedById,
					deletedById: updatedBuilding.deletedById
				}
			});

			expect(result).toEqual(updatedBuilding);
		});

		it('should throw an error if id is not present', async () => {
			await expect(buildingsRepository.update(newBuilding)).rejects.toThrow();

			expect(prismaMock.building.update).not.toHaveBeenCalled();
		});
	});

	describe('Soft Delete Building', () => {
		it('should soft delete a building successfully', async () => {
			const deletedRecord: PrismaBuilding = { ...record, deletedAt: new Date(), deletedById: 1 };
			prismaMock.building.update.mockResolvedValue(deletedRecord);

			const deletedBuilding = Building.fromPersistence({
				...deletedRecord,
				constructionType: constructionTypeMap[deletedRecord.constructionType]
			});

			await buildingsRepository.softDelete(deletedBuilding);

			expect(prismaMock.building.update).toHaveBeenCalledWith({
				where: { id: deletedBuilding.id },
				data: {
					deletedAt: deletedBuilding.deletedAt,
					deletedById: deletedBuilding.deletedById
				}
			});
		});
	});

	describe('Delete Building', () => {
		it('should delete building successfully', async () => {
			await buildingsRepository.delete(building);

			expect(prismaMock.building.delete).toHaveBeenCalledWith({
				where: {
					id: building.id
				}
			});
		});
	});

	describe('Find All Buildings', () => {
		it('should find all buildings with no filters', async () => {
			prismaMock.building.findMany.mockResolvedValue([record]);

			const result = await buildingsRepository.findAll();

			expect(prismaMock.building.findMany).toHaveBeenCalledWith({
				where: {},
				orderBy: {},
				take: undefined,
				skip: undefined
			});

			expect(result).toEqual([building]);
		});

		it('should find buildings with optional filters', async () => {
			prismaMock.building.findMany.mockResolvedValue([record]);

			const filters: BuildingQueryOptions = {
				filters: { bedrooms: 3, veranda: true },
				sort: {
					field: BuildingSortableFields.CREATED_AT,
					direction: SortDirection.DESC
				},
				pagination: {
					offset: 0,
					limit: 10
				}
			};
			const result = await buildingsRepository.findAll(filters);

			expect(prismaMock.building.findMany).toHaveBeenCalledWith({
				where: {
					bedrooms: 3,
					veranda: true
				},
				orderBy: {
					createdAt: 'desc'
				},
				take: 10,
				skip: 0
			});

			expect(result).toEqual([building]);
		});
	});

	describe('Find All Count', () => {
		it('should return count of buildings with no filters', async () => {
			prismaMock.building.count.mockResolvedValue(5);

			const result = await buildingsRepository.findAllCount();

			expect(prismaMock.building.count).toHaveBeenCalledWith({
				where: {}
			});

			expect(result).toBe(5);
		});

		it('should return count of buildings with filters', async () => {
			const filters: BuildingFilterOptions = {
				bedrooms: 3,
				veranda: true
			};
			prismaMock.building.count.mockResolvedValue(5);

			const result = await buildingsRepository.findAllCount(filters);

			expect(prismaMock.building.count).toHaveBeenCalledWith({
				where: {
					bedrooms: 3,
					veranda: true
				}
			});

			expect(result).toBe(5);
		});
	});
});
