import type { PageServerLoad } from './$types';
import {
	ListingSortableFields,
	type AllBuildingDetailsWithTypes
} from '$lib/types/listings/listings.repository.types';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import type { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { SortDirection } from '$lib/types/prisma/prisma.service.types';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper';
import type { ListingDto } from '$lib/dtos/listing.dto';

export const load: PageServerLoad = async ({ params }) => {
	const details: AllBuildingDetailsWithTypes =
		await getListingsService().findAllBuildingDetailsByType(
			params.type.toUpperCase() as ConstructionType
		);
	const total = await getListingsService().getBuildingsByTypeCount(
		params.type.toUpperCase() as ConstructionType
	);

	console.log('Details:', details);
	const listings = await getListingsService().find({
		filters: {
			building: {
				constructionType: params.type.toUpperCase() as ConstructionType
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

	const listingsDto: ListingDto[] = listings.map(ListingMapper.toDtoFromDomain);

	return { listings: listingsDto, details, total };
};
