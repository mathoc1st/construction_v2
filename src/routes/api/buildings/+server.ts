import { filterListingsSchema } from '$lib/dtos/listing.dto.js';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper.js';
import { getListingsService } from '$lib/server/api/listings/listings.service.js';

export const GET = async ({ url }) => {
	console.log(url.searchParams);
	const constructionType = url.searchParams.get('type')?.toUpperCase();
	const page = url.searchParams.get('page');
	const limit = url.searchParams.get('limit');
	const sortType = url.searchParams.get('sortType');
	const sortField = url.searchParams.get('sortField');
	const sortDirection = url.searchParams.get('sortDirection');
	const floors = url.searchParams.getAll('floor');
	const finishes = url.searchParams.getAll('finish');
	const sizes = url.searchParams.getAll('size');
	const veranda = url.searchParams.get('veranda');

	const result = filterListingsSchema.safeParse({
		constructionType,
		page,
		...(limit ? { limit } : {}),
		sortType,
		sortField,
		sortDirection,
		floors,
		finishes,
		sizes,
		veranda
	});

	if (!result.success) {
		return new Response(JSON.stringify({ error: result.error }), { status: 400 });
	}

	const listings = await getListingsService().find({
		filters: {
			building: {
				floors: result.data.floors,
				constructionType: result.data.constructionType,
				hasVeranda: result.data.veranda
			},
			finish: {
				type: result.data.finishes
			}
		}
		// ...(result.data.sortType && result.data.sortField && result.data.sortDirection
		// 	? {
		// 			sort: {
		// 				type: result.data.sortType,
		// 				sort: {
		// 					field: result.data.sortField,
		// 					direction: result.data.sortDirection
		// 				}
		// 			}
		// 		}
		// 	: {}),
	});

	return new Response(JSON.stringify(listings.map(ListingMapper.toDtoFromDomain)), { status: 200 });
};
