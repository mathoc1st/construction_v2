import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user) {
		return { isAdmin: true };
	}
	return { isAdmin: false };
};
