import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { getListingsService } from '$lib/server/api/listings/listings.service.js';
import type { User } from '$lib/server/api/users/user.domain.js';
import { addListingWithRelationsSchema } from '$lib/dtos/listing.dto';
import type { Session } from '$lib/server/api/auth/session/session.domain';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user: User | null = locals.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const form = await superValidate(zod4(addListingWithRelationsSchema), {
		errors: false
	});

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const session: Session | null = await locals.session;

		if (session == null) {
			throw error(401, 'Unauthorized');
		}

		const form = await superValidate(request, zod4(addListingWithRelationsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await getListingsService().addListingWithRelations({
			finishes: form.data.finishes,
			building: form.data.building,
			listing: form.data.listing,
			performedById: session.userId
		});

		return message(form, 'Form posted successfully!');
	}
};
