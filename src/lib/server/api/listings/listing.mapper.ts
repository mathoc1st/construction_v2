import { type ListingPersistence } from '$lib/types/listings/listing.domain.types';
import { BuildingMapper } from '../buildings/building.mapper';
import { ImageMapper } from '../images/image.mapper';
import { UserId } from '../users/user.domain';
import { Listing, ListingId } from './listing.domain';

export class ListingMapper {
	static toPersistenceFromDomain(listing: Listing): ListingPersistence {
		return {
			id: listing.id.value,
			title: listing.title,
			images: listing.images.map(ImageMapper.toPersistenceFromDomain),
			views: listing.views,
			createdAt: listing.createdAt,
			updatedAt: listing.updatedAt,
			deletedAt: listing.deletedAt,
			createdById: listing.createdById.value,
			updatedById: listing.updatedById.value,
			deletedById: listing.deletedById?.value ?? null,
			building: BuildingMapper.toPersistenceFromDomain(listing.building)
		};
	}

	static toDomainFromPersistence(record: ListingPersistence): Listing {
		return Listing.fromPersistence({
			...record,
			id: new ListingId(record.id),
			createdById: new UserId(record.createdById),
			updatedById: new UserId(record.updatedById),
			deletedById: record.deletedById ? new UserId(record.deletedById) : null,
			images: record.images.map((img) => ImageMapper.toDomainFromPersistence(img)),
			building: BuildingMapper.toDomainFromPersistence(record.building)
		});
	}
}
