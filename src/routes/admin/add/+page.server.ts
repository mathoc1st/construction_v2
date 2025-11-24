import { addBuilding } from '$lib/server/services/building';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const { error: addBuildingError } = await addBuilding(formData);

		if (addBuildingError) return fail(addBuildingError.code, { message: addBuildingError.message });
	}
} satisfies Actions;
