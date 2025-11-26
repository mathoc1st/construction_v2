import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user) {
		return;
	}

	const last = event.url.pathname.split('/').filter(Boolean).at(-1);

	if (last === 'login') {
		return;
	}

	return redirect(302, '/');
};
