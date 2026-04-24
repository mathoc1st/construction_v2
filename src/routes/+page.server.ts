import { getBuildingsByType } from '$lib/server/db/queries/building';
import { BuildingType, SortBy } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [popularFrames, popularBarns, popularContainers] = await Promise.all([
		getBuildingsByType({ type: BuildingType.FRAME, sortBy: SortBy.POPULARITY_DESC, limit: 3 }),
		getBuildingsByType({ type: BuildingType.BARN, sortBy: SortBy.POPULARITY_DESC, limit: 3 }),
		getBuildingsByType({ type: BuildingType.CONTAINER, sortBy: SortBy.POPULARITY_DESC, limit: 3 })
	]);

	return { popularFrames, popularBarns, popularContainers };
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
