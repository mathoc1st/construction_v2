import { getMinioService } from '$lib/server/api/minio/minio.service.js';

export const GET = async ({ url }) => {
	const key = url.searchParams.get('key');

	if (!key) {
		return new Response('Missing key', { status: 400 });
	}

	const signedUrl = await getMinioService().generatePresignedGetUrl('images', key, 60 * 60); // URL valid for 1 hour

	return new Response(JSON.stringify({ url: signedUrl }));
};

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const files = formData.getAll('files') as File[];

	const uploadedKeys = [];

	for (const file of files) {
		const key = await getMinioService().uploadImages(file);
		uploadedKeys.push(key);
	}

	return new Response(JSON.stringify({ keys: uploadedKeys }));
};
