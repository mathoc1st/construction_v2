import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper';
import { ListingId } from '$lib/server/api/listings/listing.domain';
import type { ImageDto } from '$lib/dtos/image.dto';
import { getImageService } from '$lib/server/api/images/images.service';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const listing = await getListingsService().getById(new ListingId(id));

	if (listing) {
		const images: ImageDto[] = await Promise.all(
			listing.images.map(async (img) => {
				const url = await getImageService().getImageUrl(img);

				return {
					id: img.id.value,
					url,
					order: img.order
				};
			})
		);

		const listingDto = ListingMapper.toDtoFromDomain(listing);

		return {
			...listingDto,
			images
		};
	}

	error(404, 'Not found');
};

export const actions = {
	default: async ({ request, url }) => {
		try {
			const formData = await request.formData();

			const phone = formData.get('phone');

			const text = `Кто-то заинтересовался <a href="${url}">домом</a>\n📞 Телефон: ${phone}`;

			const botUrl = `https://api.telegram.org/bot8537150064:AAH3NVo6GPCuUPk1MVM7W0alQjQn-zGS6bk/sendMessage`;
			await fetch(botUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: '-4932652505', text, parse_mode: 'HTML' })
			});

			return { success: true };
		} catch {
			return { success: false };
		}
	}
} satisfies Actions;
