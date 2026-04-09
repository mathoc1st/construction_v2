import type { Session } from '$lib/server/api/auth/session/session.domain';
import { ListingId } from '$lib/server/api/listings/listing.domain.js';
import { getListingsService } from '$lib/server/api/listings/listings.service.js';
import { fail } from '@sveltejs/kit';

export const DELETE = async ({ url, locals }) => {
	const session: Session | null = await locals.session;

	if (session == null) {
		throw fail(401, 'Unauthorized');
	}

	const id = url.searchParams.get('id');

	if (!id) {
		return new Response('Missing id', { status: 400 });
	}

	await getListingsService().softDelete(new ListingId(id), session.userId);

	return new Response(null, { status: 204 });
};
