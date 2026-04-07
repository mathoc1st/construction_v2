import type { ListingDto, ListingWithRelationsDto } from '$lib/dtos/listing.dto';
import type { Prisma, Listing as PrismaListing } from '$lib/server/api/prisma/generated/client';
import type { ListingWithRelations } from '$lib/types/listings/listings.repository.types';
import { Listing as DomainListing } from './listing.domain';

export class ListingMapper {
	static toDtoWithRelationsFromDomain(data: ListingWithRelations): ListingWithRelationsDto {
		return {
			listing: {
				id: data.listing.id,
				title: data.listing.record.title,
				images: data.listing.record.images,
				views: data.listing.record.views
			},
			building: data.building
				? {
						id: data.building.id,
						constructionType: data.building.record.constructionType,
						width: data.building.record.width,
						length: data.building.record.length,
						height: data.building.record.height,
						bedrooms: data.building.record.bedrooms,
						bathrooms: data.building.record.bathrooms,
						floors: data.building.record.floors,
						veranda: data.building.record.veranda
					}
				: null,
			finishes: data.finishes.map((finish) => ({
				id: finish.id,
				description: finish.record.description,
				type: finish.record.type,
				price: finish.record.price,
				originalPrice: finish.record.originalPrice,
				createdAt: finish.record.createdAt,
				updatedAt: finish.record.updatedAt,
				deletedAt: finish.record.deletedAt,
				createdById: finish.record.createdById,
				updatedById: finish.record.updatedById,
				deletedById: finish.record.deletedById
			}))
		};
	}

	static toDtoFromDomainWithId(id: number, listing: DomainListing): ListingDto {
		return {
			id,
			title: listing.title,
			images: listing.images,
			views: listing.views
		};
	}

	static toDomainFromPrisma(record: PrismaListing): DomainListing {
		return DomainListing.fromPersistence({
			...record
		});
	}

	static toPrismaFromDomain(listing: DomainListing): Omit<PrismaListing, 'id' | 'buildingId'> {
		return {
			title: listing.title,
			images: listing.images,
			views: listing.views,
			createdAt: listing.createdAt,
			updatedAt: listing.updatedAt,
			deletedAt: listing.deletedAt,
			createdById: listing.createdById,
			updatedById: listing.updatedById,
			deletedById: listing.deletedById
		};
	}

	static toPrismaCreateFromDomain(listing: DomainListing): Prisma.ListingCreateInput {
		return {
			title: listing.title,
			images: listing.images,
			views: listing.views,
			createdBy: {
				connect: { id: listing.createdById }
			},
			updatedBy: {
				connect: { id: listing.updatedById }
			},
			deletedBy: listing.deletedById
				? {
						connect: { id: listing.deletedById }
					}
				: undefined
		};
	}

	static toPrismaUpdateFromDomain(listing: DomainListing): Prisma.ListingUpdateInput {
		return {
			title: listing.title,
			images: listing.images,
			views: listing.views,
			updatedAt: listing.updatedAt,
			updatedBy: {
				connect: { id: listing.updatedById }
			}
		};
	}
}
