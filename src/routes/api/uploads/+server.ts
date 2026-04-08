import type { ImageDto } from '$lib/dtos/image.dto.js';
import type { Session } from '$lib/server/api/auth/session/session.domain.js';
import { getImageService } from '$lib/server/api/images/images.service.js';

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

export const POST = async ({ request, locals }) => {
	const session: Session | null = await locals.session;

	if (session == null) {
		throw fail(401, 'Unauthorized');
	}

	const formData = await request.formData();
	const files = formData.getAll('files') as File[];

	const images = await getImageService().uploadImages(files, session.userId);
	const imageDtos: ImageDto[] = images.map((img) => ({
		id: img.id.value,
		folder: img.folder,
		bucket: img.bucket,
		key: img.key
	}));

	return new Response(JSON.stringify(imageDtos));
};
