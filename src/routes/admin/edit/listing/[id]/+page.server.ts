import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, superValidate } from 'sveltekit-superforms';
import { getListingsService } from '$lib/server/api/listings/listings.service';
import type { Session } from '$lib/server/api/auth/session/session.domain';
import { listingWithRelationsSchema } from '$lib/dtos/listing.dto';
import { error } from '@sveltejs/kit';
import { ListingMapper } from '$lib/server/api/listings/listing.mapper.js';
import { BuildingMapper } from '$lib/server/api/buildings/building.mapper.js';
import { FinishMapper } from '$lib/server/api/finishes/finish.mapper.js';

export const load = async ({ params }) => {
	const id = Number(params.id);

	if (isNaN(id)) {
		throw error(400, 'Invalid listing ID');
	}

	const result = await getListingsService().getListingWithRelations(id);

	if (!result) {
		throw error(404, 'Listing not found');
	}

	if (!result.building) {
		throw error(500, 'Listing is missing associated building');
	}

	if (!result.finishes) {
		throw error(500, 'Listing is missing associated finishes');
	}

	const { listing, building, finishes } = result;

	const form = await superValidate(
		{
			listing: ListingMapper.toDtoFromDomainWithId(listing.id, listing.record),
			building: BuildingMapper.toDtoFromDomainWithId(building.id, building.record),
			finishes: finishes.map((finish) =>
				FinishMapper.toDtoFromDomainWithId(finish.id, finish.record)
			)
		},
		zod4(listingWithRelationsSchema)
	);

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const session: Session | null = await locals.session;

		if (session == null) {
			throw error(401, 'Unauthorized');
		}

		const form = await superValidate(request, zod4(listingWithRelationsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.building?.id == null) {
			return fail(400, { form });
		}

		await getListingsService().updateListingWithRelations({
			listing: {
				...form.data.listing,
				targetId: form.data.listing.id
			},
			building: {
				...form.data.building,
				targetId: form.data.building.id
			},
			finishes: form.data.finishes.map((finish) => ({
				...finish,
				targetId: finish.id
			})),
			performedById: session.userId
		});
	}
};
