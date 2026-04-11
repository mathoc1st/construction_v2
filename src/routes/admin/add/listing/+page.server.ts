import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, message, superValidate } from 'sveltekit-superforms';
import type { User } from '$lib/server/api/users/user.domain.js';
import type { Session } from '$lib/server/api/auth/session/session.domain';
import { error } from '@sveltejs/kit';
import { addListingSchema } from '$lib/dtos/listing.dto.js';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import { ImageId } from '$lib/server/api/images/image.domain.js';

export const load = async ({ locals }) => {
	const user: User | null = locals.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const form = await superValidate(zod4(addListingSchema), {
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

		const form = await superValidate(request, zod4(addListingSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const listing = await getListingsService().add(
			{
				title: form.data.title,
				building: {
					constructionType: form.data.building.constructionType,
					width: form.data.building.width,
					length: form.data.building.length,
					height: form.data.building.height,
					bedrooms: form.data.building.bedrooms,
					bathrooms: form.data.building.bathrooms,
					floors: form.data.building.floors,
					hasVeranda: form.data.building.hasVeranda,
					finishes: form.data.building.finishes.map((f) => ({
						type: f.type,
						description: f.description,
						price: f.price,
						originalPrice: f.originalPrice
					}))
				},
				images: form.data.images.map((img) => ({ id: new ImageId(img.id) }))
			},
			session.userId
		);

		return message(form, 'Form posted successfully!');
	}
};
