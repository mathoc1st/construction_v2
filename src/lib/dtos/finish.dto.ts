import { FinishType } from '$lib/types/finishes/finish.domain.types';
import z from 'zod';

export const finishSchema = z.object({
	id: z.number().int().positive().optional(),
	type: z.enum(FinishType),
	description: z.string().min(1),
	price: z.number().positive(),
	originalPrice: z.number().positive().nullish()
});

export type FinishDto = z.infer<typeof finishSchema>;

export const addFinishSchema = finishSchema.omit({ id: true });

export type AddFinishDto = z.infer<typeof addFinishSchema>;
