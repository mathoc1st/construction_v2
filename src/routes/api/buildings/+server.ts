import { filterListingsSchema } from '$lib/dtos/listing.dto.js';
import { getImageService } from '$lib/server/api/images/images.service';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper.js';
import { getListingsService } from '$lib/server/api/listings/listings.service.js';
import type {
	ListingQueryOptions,
	SortOptionsV2
} from '$lib/types/listings/listings.repository.types';

export const GET = async ({ url }) => {
	const constructionType = url.searchParams.get('constructionType')?.toUpperCase();
	const page = url.searchParams.get('page');
	const limit = url.searchParams.get('limit');
	const floors = url.searchParams.getAll('floors');
	const finishes = url.searchParams.getAll('finishTypes');
	const sizes = url.searchParams.getAll('sizes');
	const veranda = url.searchParams.get('veranda');
	const dimensions = url.searchParams.getAll('dimensions');
	const sortBy = url.searchParams.get('sortBy');

	const hasVeranda = JSON.parse(veranda ?? 'null');
	const sortByFilter = JSON.parse(sortBy ?? '{}') as SortOptionsV2;

	const parsedDimensions: { width: number; length: number }[] = [];
	for (const dim of dimensions) {
		try {
			const parsed = JSON.parse(dim);
			if (typeof parsed.width === 'number' && typeof parsed.length === 'number') {
				parsedDimensions.push(parsed);
			} else {
				return new Response(JSON.stringify({ err: 'Invalid dimensions format' }), { status: 400 });
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			return new Response(JSON.stringify({ err: 'Invalid dimensions format' }), { status: 400 });
		}
	}

	const result = filterListingsSchema.safeParse({
		constructionType,
		page,
		limit,
		floors,
		finishes,
		sizes,
		veranda: hasVeranda,
		dimensions: parsedDimensions
	});

	if (!result.success) {
		return new Response(JSON.stringify({ error: result.error }), { status: 400 });
	}

	const filters: ListingQueryOptions = {
		filters: {
			building: {
				floors: result.data.floors,
				constructionType: result.data.constructionType,
				hasVeranda: result.data.veranda,
				dimensions: result.data.dimensions
			},
			finish: {
				type: result.data.finishes
			}
		},
		sort: {
			...(sortByFilter.views != null ? { views: sortByFilter.views } : {}),
			...(sortByFilter.price != null ? { price: sortByFilter.price } : {})
		},
		pagination: {
			offset: ((result.data.page ?? 1) - 1) * (result.data.limit ?? 12),
			limit: result.data.limit ?? 12
		}
	};

	const listings = await getListingsService().find(filters);
	const total = await getListingsService().findCount(filters);

	const listingDto = await Promise.all(
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

	return new Response(
		JSON.stringify({
			listings: listingDto,
			total
		}),
		{ status: 200 }
	);
};
