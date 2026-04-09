import type { ListingDto } from '$lib/dtos/listing.dto';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import { ListingSortableFields } from '$lib/types/listings/listings.repository.types';
import { SortDirection } from '$lib/types/prisma/prisma.service.types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const listingService = getListingsService();

	const [popularFrames, popularBarns, popularContainers] = await Promise.all([
		listingService.find({
			filters: { building: { constructionType: ConstructionType.FRAME } },
			sort: {
				type: 'listing',
				sort: { field: ListingSortableFields.VIEWS, direction: SortDirection.DESC }
			},
			pagination: { limit: 3 }
		}),
		listingService.find({
			filters: { building: { constructionType: ConstructionType.BARN } },
			sort: {
				type: 'listing',
				sort: { field: ListingSortableFields.VIEWS, direction: SortDirection.DESC }
			},
			pagination: { limit: 3 }
		}),
		listingService.find({
			filters: { building: { constructionType: ConstructionType.CONTAINER } },
			sort: {
				type: 'listing',
				sort: { field: ListingSortableFields.VIEWS, direction: SortDirection.DESC }
			},
			pagination: { limit: 3 }
		})
	]);

	const popularFramesDto: ListingDto[] = popularFrames.map(ListingMapper.toDtoFromDomain);
	const popularBarnsDto: ListingDto[] = popularBarns.map(ListingMapper.toDtoFromDomain);
	const popularContainersDto: ListingDto[] = popularContainers.map(ListingMapper.toDtoFromDomain);

	return { popularFramesDto, popularBarnsDto, popularContainersDto };
};

export const actions = {
	support: async ({ request }) => {
		try {
			const formData = await request.formData();

			const name = formData.get('name');
			const email = formData.get('email');
			const phone = formData.get('phone');
			const message = formData.get('message');

			const text = `${name} спрашивает\n"${message}"\n\n📞 Телефон: ${phone}\n✉️Почта: ${email}`;

			const botUrl = `https://api.telegram.org/bot8537150064:AAH3NVo6GPCuUPk1MVM7W0alQjQn-zGS6bk/sendMessage`;
			await fetch(botUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: '-4932652505', text })
			});

			return { supportSuccess: true };
		} catch {
			return { supportSuccess: false };
		}
	},
	free: async ({ request }) => {
		try {
			const formData = await request.formData();

			const phone = formData.get('phone');

			const text = `Запрос бесплатной сметы: ${phone}`;

			const botUrl = `https://api.telegram.org/bot8537150064:AAH3NVo6GPCuUPk1MVM7W0alQjQn-zGS6bk/sendMessage`;
			await fetch(botUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: '-4932652505', text })
			});

			return { freeSuccess: true };
		} catch {
			return { freeSuccess: false };
		}
	}
} satisfies Actions;
