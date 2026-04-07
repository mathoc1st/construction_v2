import { ConstructionType } from '$lib/types/buildings/building.domain.types';
import z from 'zod';

export const buildingSchema = z.object({
	id: z.number().int().positive(),
	constructionType: z.enum(ConstructionType),
	width: z.number().positive(),
	length: z.number().positive(),
	height: z.number().positive(),
	bedrooms: z.number().int().nonnegative(),
	bathrooms: z.number().int().nonnegative(),
	floors: z.number().int().positive(),
	veranda: z.boolean()
});

export type BuildingDto = z.infer<typeof buildingSchema>;

export const addBuildingSchema = buildingSchema.omit({ id: true });

export type AddBuildingDto = z.infer<typeof addBuildingSchema>;
