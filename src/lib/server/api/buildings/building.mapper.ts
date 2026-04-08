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
}
