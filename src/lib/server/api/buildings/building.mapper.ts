import { Building, BuildingId } from './building.domain';
import { type BuildingPersistence } from '$lib/types/buildings/building.domain.types';
import { UserId } from '../users/user.domain';
import { FinishMapper } from '../finishes/finish.mapper';

export class BuildingMapper {
	static toDomainFromPersistence(record: BuildingPersistence): Building {
		return Building.fromPersistence({
			...record,
			id: new BuildingId(record.id),
			createdById: new UserId(record.createdById),
			updatedById: new UserId(record.updatedById),
			deletedById: record.deletedById ? new UserId(record.deletedById) : null,
			finishes: record.finishes.map((finish) => {
				return FinishMapper.toDomainFromPersistence(finish);
			})
		});
	}

	static toPersistenceFromDomain(building: Building): BuildingPersistence {
		return {
			id: building.id.value,
			constructionType: building.constructionType,
			width: building.width,
			length: building.length,
			height: building.height,
			bedrooms: building.bedrooms,
			bathrooms: building.bathrooms,
			floors: building.floors,
			hasVeranda: building.hasVeranda,
			createdAt: building.createdAt,
			updatedAt: building.updatedAt,
			deletedAt: building.deletedAt,
			createdById: building.createdById.value,
			updatedById: building.updatedById.value,
			deletedById: building.deletedById ? building.deletedById.value : null,
			finishes: building.finishes.map((finish) => ({
				id: finish.id.value,
				description: finish.description,
				type: finish.type,
				price: finish.price,
				originalPrice: finish.originalPrice,
				createdAt: finish.createdAt,
				updatedAt: finish.updatedAt,
				deletedAt: finish.deletedAt,
				createdById: finish.createdById.value,
				updatedById: finish.updatedById.value,
				deletedById: finish.deletedById ? finish.deletedById.value : null
			}))
		};
	}
	// static toDtoFromDomainWithId(id: number, building: DomainBuilding): BuildingDto {
	// 	return {
	// 		id,
	// 		constructionType: building.constructionType,
	// 		width: building.width,
	// 		length: building.length,
	// 		height: building.height,
	// 		bedrooms: building.bedrooms,
	// 		bathrooms: building.bathrooms,
	// 		floors: building.floors,
	// 		veranda: building.hasVeranda
	// 	};
	// }
	// static toDomainFromPrisma(record: PrismaBuilding): DomainBuilding {
	// 	return DomainBuilding.fromPersistence({
	// 		...record,
	// 		constructionType: constructionTypePrismaMap[record.constructionType]
	// 	});
	// }
	// static toPrismaFromDomain(building: DomainBuilding): Omit<PrismaBuilding, 'id' | 'listingId'> {
	// 	return {
	// 		constructionType: building.constructionType,
	// 		width: building.width,
	// 		length: building.length,
	// 		height: building.height,
	// 		bedrooms: building.bedrooms,
	// 		bathrooms: building.bathrooms,
	// 		floors: building.floors,
	// 		veranda: building.hasVeranda,
	// 		createdAt: building.createdAt,
	// 		updatedAt: building.updatedAt,
	// 		deletedAt: building.deletedAt,
	// 		createdById: building.createdById,
	// 		updatedById: building.updatedById,
	// 		deletedById: building.deletedById
	// 	};
	// }
	// static toPrismaCreateFromDomain(
	// 	building: DomainBuilding
	// ): Omit<Prisma.BuildingCreateInput, 'listing'> {
	// 	return {
	// 		constructionType: building.constructionType,
	// 		width: building.width,
	// 		length: building.length,
	// 		height: building.height,
	// 		bedrooms: building.bedrooms,
	// 		bathrooms: building.bathrooms,
	// 		floors: building.floors,
	// 		veranda: building.hasVeranda,
	// 		createdBy: {
	// 			connect: { id: building.createdById }
	// 		},
	// 		updatedBy: {
	// 			connect: { id: building.updatedById }
	// 		},
	// 		deletedBy: building.deletedById
	// 			? {
	// 					connect: { id: building.deletedById }
	// 				}
	// 			: undefined
	// 	};
	// }
	// static toPrismaUpdateFromDomain(building: DomainBuilding): Prisma.BuildingUpdateInput {
	// 	return {
	// 		constructionType: building.constructionType,
	// 		width: building.width,
	// 		length: building.length,
	// 		height: building.height,
	// 		bedrooms: building.bedrooms,
	// 		bathrooms: building.bathrooms,
	// 		floors: building.floors,
	// 		veranda: building.hasVeranda,
	// 		updatedAt: building.updatedAt,
	// 		updatedBy: {
	// 			connect: { id: building.updatedById }
	// 		}
	// 	};
	// }
}
