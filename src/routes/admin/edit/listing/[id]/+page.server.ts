import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, superValidate } from 'sveltekit-superforms';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import type { Session } from '$lib/server/api/auth/session/session.domain';
import { error } from '@sveltejs/kit';
import { ListingId } from '$lib/server/api/listings/listing.domain.js';
import { listingSchema } from '$lib/dtos/listing.dto.js';
import { FinishId } from '$lib/server/api/finishes/finish.domain.js';
import { ImageId } from '$lib/server/api/images/image.domain.js';

export const load = async ({ params }) => {
	const id = params.id;

	const result = await getListingsService().getById(new ListingId(id));

	if (!result) {
		throw error(404, 'Listing not found');
	}

	const form = await superValidate(
		{
			id: result.id.value,
			title: result.title,
			views: result.views,
			building: {
				id: result.building.id.value,
				constructionType: result.building.constructionType,
				width: result.building.width,
				length: result.building.length,
				height: result.building.height,
				bedrooms: result.building.bedrooms,
				bathrooms: result.building.bathrooms,
				floors: result.building.floors,
				hasVeranda: result.building.hasVeranda,
				finishes: result.building.finishes.map((f) => ({
					id: f.id.value,
					type: f.type,
					description: f.description,
					price: f.price,
					originalPrice: f.originalPrice
				}))
			},
			images: result.images.map((img) => ({
				id: img.id.value,
				folder: img.folder,
				key: img.key,
				bucket: img.bucket
			}))
		},
		zod4(listingSchema),
		{ errors: false }
	);

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const session: Session | null = await locals.session;

		if (session == null) {
			throw error(401, 'Unauthorized');
		}

		const form = await superValidate(request, zod4(listingSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.building?.id == null || form.data.id == null) {
			return fail(400, { form });
		}

		await getListingsService().update(new ListingId(form.data.id), session.userId, {
			title: form.data.title,
			images: form.data.images.map((img) => ({
				id: new ImageId(img.id),
				folder: img.folder,
				key: img.key,
				bucket: img.bucket
			})),
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
					id: f.id ? new FinishId(f.id) : undefined,
					type: f.type,
					description: f.description,
					price: f.price,
					originalPrice: f.originalPrice
				}))
			}
		});
	}
};
