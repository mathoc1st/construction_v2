import { Building as DomainBuilding } from './building.domain';
import type { Prisma, Building as PrismaBuilding } from '$lib/server/api/prisma/generated/client';
import { ConstructionType as DomainConstructionType } from '$lib/types/buildings/building.domain.types';
import { ConstructionType as PrismaConstructionType } from '$lib/server/api/prisma/generated/client';
import type { BuildingDto } from '$lib/dtos/building.dto';

const constructionTypePrismaMap: Record<PrismaConstructionType, DomainConstructionType> = {
	FRAME: DomainConstructionType.FRAME,
	BARN: DomainConstructionType.BARN,
	CONTAINER: DomainConstructionType.CONTAINER
};

export class BuildingMapper {
	static toDtoFromDomainWithId(id: number, building: DomainBuilding): BuildingDto {
		return {
			id,
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			veranda: building.veranda
		};
	}

	static toDomainFromPrisma(record: PrismaBuilding): DomainBuilding {
		return DomainBuilding.fromPersistence({
			...record,
			constructionType: constructionTypePrismaMap[record.constructionType]
		});
	}

	static toPrismaFromDomain(building: DomainBuilding): Omit<PrismaBuilding, 'id' | 'listingId'> {
		return {
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			veranda: building.veranda,
			createdAt: building.createdAt,
			updatedAt: building.updatedAt,
			deletedAt: building.deletedAt,
			createdById: building.createdById,
			updatedById: building.updatedById,
			deletedById: building.deletedById
		};
	}

	static toPrismaCreateFromDomain(
		building: DomainBuilding
	): Omit<Prisma.BuildingCreateInput, 'listing'> {
		return {
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			veranda: building.veranda,
			createdBy: {
				connect: { id: building.createdById }
			},
			updatedBy: {
				connect: { id: building.updatedById }
			},
			deletedBy: building.deletedById
				? {
						connect: { id: building.deletedById }
					}
				: undefined
		};
	}

	static toPrismaUpdateFromDomain(building: DomainBuilding): Prisma.BuildingUpdateInput {
		return {
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			veranda: building.veranda,
			updatedAt: building.updatedAt,
			updatedBy: {
				connect: { id: building.updatedById }
			}
		};
	}
}
