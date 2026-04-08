import z from 'zod';

export const imageSchema = z.object({
	id: z.uuidv7(),
	folder: z.string().min(1),
	bucket: z.string().min(1),
	key: z.string().min(1)
});

export type ImageDto = z.infer<typeof imageSchema>;
