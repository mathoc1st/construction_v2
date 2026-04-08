import z from 'zod';
import { addBuildingSchema, buildingSchema } from './building.dto';
import { imageSchema } from './image.dto';

export const listingSchema = z.object({
	id: z.uuidv7().optional(),
	title: z.string().min(1),
	images: z.array(imageSchema).default([]),
	views: z.number().int().default(0),
	building: buildingSchema
});

export type ListingDto = z.infer<typeof listingSchema>;

export const addListingSchema = z.object({
	title: z.string().min(1),
	images: z.array(imageSchema).default([]),
	views: z.number().int().default(0),
	building: addBuildingSchema
});
