import z from 'zod';
import { addBuildingSchema, buildingSchema } from './building.dto';
import { imageSchema } from './image.dto';
import { ConstructionType } from '$lib/types/buildings/building.domain.types';

import { FinishType } from '$lib/types/finishes/finish.domain.types';
import { SortDirection } from '$lib/types/prisma/prisma.service.types';

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

export const filterListingsSchema = z.object({
	constructionType: z.enum(ConstructionType).optional(),
	page: z.coerce.number().int().min(1).optional(),
	limit: z.coerce.number().int().min(1).optional(),
	floors: z.array(z.coerce.number().int()).optional(),
	finishes: z.array(z.enum(FinishType)).optional(),
	veranda: z.coerce.boolean().optional(),
	sortDirection: z.enum(SortDirection).optional()
});

// const constructionType = url.searchParams.get('type');
// 	const page = url.searchParams.get('page');
// 	const limit = url.searchParams.get('limit');
// 	const sortType = url.searchParams.get('sortType');
// 	const sortField = url.searchParams.get('sortField');
// 	const sortDirection = url.searchParams.get('sortDirection');
// 	const floors = url.searchParams.getAll('floor');
// 	const finishes = url.searchParams.getAll('finish');
// 	const sizes = url.searchParams.getAll('size');
// 	const veranda = url.searchParams.get('veranda');
