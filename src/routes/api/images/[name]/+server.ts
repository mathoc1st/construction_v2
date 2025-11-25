import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	// Path to your images folder
	const filePath = path.resolve(`uploads/images/${params.name}`);

	// Check if file exists
	if (!fs.existsSync(filePath)) {
		return new Response('Not found', { status: 404 });
	}

	// Create a read stream
	const stream = fs.createReadStream(filePath);

	// Infer content type based on extension
	const ext = path.extname(params.name).toLowerCase();
	const contentType =
		ext === '.jpg' || ext === '.jpeg'
			? 'image/jpeg'
			: ext === '.png'
				? 'image/png'
				: 'application/octet-stream';

	return new Response(stream as never, {
		headers: {
			'Content-Type': contentType
		}
	});
};
