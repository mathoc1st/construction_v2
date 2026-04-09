import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import z from 'zod';
import { addFinishSchema, finishSchema } from './finish.dto';

export const buildingSchema = z.object({
	id: z.uuidv7().optional(),
	constructionType: z.enum(ConstructionType),
	width: z.number().positive(),
	length: z.number().positive(),
	height: z.number().positive(),
	bedrooms: z.number().int().nonnegative(),
	bathrooms: z.number().int().nonnegative(),
	floors: z.number().int().positive(),
	hasVeranda: z.boolean(),
	finishes: z.array(finishSchema).default([])
});

export type BuildingDto = z.infer<typeof buildingSchema>;

export const addBuildingSchema = z.object({
	constructionType: z.enum(ConstructionType),
	width: z.number().positive(),
	length: z.number().positive(),
	height: z.number().positive(),
	bedrooms: z.number().int().nonnegative(),
	bathrooms: z.number().int().nonnegative(),
	floors: z.number().int().positive(),
	hasVeranda: z.boolean(),
	finishes: z.array(addFinishSchema).default([])
});
