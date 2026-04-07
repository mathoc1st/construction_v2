import z from 'zod';
import { addFinishSchema, finishSchema } from './finish.dto';
import { addBuildingSchema, buildingSchema } from './building.dto';

export const listingSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	images: z.array(z.string()).default([]),
	views: z.number().int().default(0)
});

export type ListingDto = z.infer<typeof listingSchema>;

export const addListingSchema = listingSchema.omit({ id: true });

export type AddListingDto = z.infer<typeof addListingSchema>;

export const addListingWithRelationsSchema = z.object({
	building: addBuildingSchema,
	listing: addListingSchema,
	finishes: z.array(addFinishSchema)
});

export type AddListingWithRelationsDto = z.infer<typeof addListingWithRelationsSchema>;

export const listingWithRelationsSchema = z.object({
	building: buildingSchema.nullable(),
	listing: listingSchema,
	finishes: z.array(finishSchema)
});

export type ListingWithRelationsDto = z.infer<typeof listingWithRelationsSchema>;
