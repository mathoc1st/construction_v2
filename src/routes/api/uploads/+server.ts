import type { ImageDto } from '$lib/dtos/image.dto.js';
import type { Session } from '$lib/server/api/auth/session/session.domain.js';
import { getImageService } from '$lib/server/api/images/images.service.js';
import { ListingId } from '$lib/server/api/listings/listing.domain.js';

import { getMinioService } from '$lib/server/api/minio/minio.service.js';
import { fail } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const key = url.searchParams.get('key');

	if (!key) {
		return new Response('Missing key', { status: 400 });
	}

	const signedUrl = await getMinioService().generatePresignedGetUrl('images', key, 60 * 60); // URL valid for 1 hour

	return new Response(JSON.stringify({ url: signedUrl }));
};

export const POST = async ({ request, locals, url }) => {
	const session: Session | null = await locals.session;

	if (session == null) {
		throw fail(401, 'Unauthorized');
	}

	const listingIdStr = url.searchParams.get('listingId');
	const listingId = listingIdStr ? new ListingId(listingIdStr) : null;

	const imageFiles: { file: File; order: number }[] = [];

	const formData = await request.formData();

	for (const [key, value] of formData.entries()) {
		if (!(value instanceof File)) continue;
		if (!key.startsWith('file:')) continue;

		const metadata = key.split(':');

		if (metadata.length < 2) continue;

		const order = Number(metadata[1]);

		if (isNaN(order)) continue;

		imageFiles.push({
			file: value,
			order
		});
	}

	const images = await getImageService().uploadImages(imageFiles, session.userId, listingId);

	const imageDtos: ImageDto[] = await Promise.all(
		images.map(async (img) => {
			const url = await getImageService().getImageUrl(img);
			return {
				id: img.id.value,
				url,
				order: img.order
			};
		})
	);

	return new Response(JSON.stringify(imageDtos));
};
