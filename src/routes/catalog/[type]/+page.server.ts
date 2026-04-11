import type { PageServerLoad } from './$types';
import { ListingSortableFields } from '$lib/types/listings/listings.repository.types';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { SortDirection } from '$lib/types/prisma/prisma.service.types';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper';
import type { ListingDto } from '$lib/dtos/listing.dto';
import z from 'zod';
import { fail } from '@sveltejs/kit';
import { getImageService } from '$lib/server/api/images/images.service';

export const load: PageServerLoad = async ({ params }) => {
	const paramResult = z.enum(ConstructionType).safeParse(params.type.toUpperCase());

	if (!paramResult.success) {
		return fail(400, { message: 'Invalid construction type' });
	}

	const details = await getListingsService().findAllBuildingDetailsByType(paramResult.data);
	const total = await getListingsService().getBuildingsByTypeCount(paramResult.data);

	const listings = await getListingsService().find({
		filters: {
			building: {
				constructionType: paramResult.data
			}
		},
		sort: {
			type: 'listing',
			sort: { field: ListingSortableFields.VIEWS, direction: SortDirection.DESC }
		},
		pagination: {
			limit: 12
		}
	});

	const listingsDto: ListingDto[] = await Promise.all(
		listings.map(async (listing) => ({
			...ListingMapper.toDtoFromDomain(listing),
			images: await Promise.all(
				listing.images.map(async (img) => ({
					id: img.id.value,
					url: await getImageService().getImageUrl(img),
					order: img.order
				}))
			)
		}))
	);

	return { listings: listingsDto, details, total };
};
