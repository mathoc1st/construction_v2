import z from 'zod';

export const imageSchema = z.object({
	id: z.uuidv7(),
	order: z.number().int(),
	url: z.url()
});

export type ImageDto = z.infer<typeof imageSchema>;
