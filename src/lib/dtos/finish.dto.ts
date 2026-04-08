import { FinishType } from '$lib/types/finishes/finish.domain.types';
import z from 'zod';

export const finishSchema = z.object({
	id: z.uuidv7().optional(),
	type: z.enum(FinishType),
	description: z.string().min(1),
	price: z.number().positive(),
	originalPrice: z.number().positive().nullish()
});

export const addFinishSchema = finishSchema.omit({ id: true });
