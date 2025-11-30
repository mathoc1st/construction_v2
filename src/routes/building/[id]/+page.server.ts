import { getBuildingById } from '$lib/server/db/queries/building';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number.parseInt(params.id);

	if (Number.isNaN(id)) return error(404);

	const building = await getBuildingById(id);

	if (building) {
		return building;
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
