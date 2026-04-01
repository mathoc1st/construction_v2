import { z } from '$lib/server/openapi/zod';

export const responseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
	z
		.object({
			success: z.literal(true),
			data: dataSchema
		})
		.or(
			z.object({
				success: z.literal(false),
				error: z.string()
			})
		);
