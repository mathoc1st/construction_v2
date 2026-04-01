import { z } from '$lib/server/openapi/zod';
import { SortDirection } from '$lib/server/prisma/prisma.types';

import { ConstructionType } from './building.domain';
import { BuildingSortableFields } from './building.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buildingDtoSchema = z.object({
	id: z.number().int().positive().openapi({
		description: 'The unique identifier of the building.',
		example: 1
	}),
	constructionType: z.enum(ConstructionType).openapi({
		description: 'The type of construction for the building.',
		example: ConstructionType.FRAME
	}),
	width: z.number().positive().openapi({
		description: 'The width of the building in meters.',
		example: 10.5
	}),
	length: z.number().positive().openapi({
		description: 'The length of the building in meters.',
		example: 15.0
	}),
	height: z.number().positive().openapi({
		description: 'The height of the building in meters.',
		example: 8.0
	}),
	bedrooms: z.number().int().nonnegative().openapi({
		description: 'The number of bedrooms in the building.',
		example: 3
	}),
	bathrooms: z.number().int().nonnegative().openapi({
		description: 'The number of bathrooms in the building.',
		example: 2
	}),
	floors: z.number().int().positive().openapi({
		description: 'The number of floors in the building.',
		example: 2
	}),
	veranda: z.boolean().openapi({
		description: 'Indicates whether the building has a veranda.',
		example: true
	}),
	createdAt: z.string().openapi({
		description:
			'The ISO string representation of the date and time when the building was created.',
		example: '2024-01-01T12:00:00Z'
	}),
	updatedAt: z.string().openapi({
		description:
			'The ISO string representation of the date and time when the building was last updated.',
		example: '2024-01-10T15:30:00Z'
	}),
	deletedAt: z.string().nullish().openapi({
		description:
			'The ISO string representation of the date and time when the building was deleted, or null if it has not been deleted.',
		example: null
	})
});

export type BuildingDto = z.infer<typeof buildingDtoSchema>;

const addBuildingDtoSchema = z.object({
	constructionType: z.enum(ConstructionType).openapi({
		description: 'The type of construction for the building.',
		example: ConstructionType.FRAME
	}),
	width: z.number().positive().openapi({
		description: 'The width of the building in meters.',
		example: 10.5
	}),
	length: z.number().positive().openapi({
		description: 'The length of the building in meters.',
		example: 15.0
	}),
	height: z.number().positive().openapi({
		description: 'The height of the building in meters.',
		example: 8.0
	}),
	bedrooms: z.number().int().nonnegative().openapi({
		description: 'The number of bedrooms in the building.',
		example: 3
	}),
	bathrooms: z.number().int().nonnegative().openapi({
		description: 'The number of bathrooms in the building.',
		example: 2
	}),
	floors: z.number().int().positive().openapi({
		description: 'The number of floors in the building.',
		example: 2
	}),
	veranda: z.boolean().openapi({
		description: 'Indicates whether the building has a veranda.',
		example: true
	})
});

export type AddBuildingDto = z.infer<typeof addBuildingDtoSchema>;

export const updateBuildingDtoSchema = addBuildingDtoSchema.partial().extend({
	targetId: z.number().int().positive().openapi({
		description: 'The ID of the building to update.',
		example: 1
	})
});

export type UpdateBuildingDto = z.infer<typeof updateBuildingDtoSchema>;

export const deleteBuildingDtoSchema = z.object({
	targetId: z.number().int().positive().openapi({
		description: 'The ID of the building to delete.',
		example: 1
	})
});

export type DeleteBuildingDto = z.infer<typeof deleteBuildingDtoSchema>;

export const buildingQueryOptionsDtoSchema = z.object({
	filters: z
		.object({
			constructionType: z.enum(ConstructionType).openapi({
				description: 'Filter by construction type.',
				example: ConstructionType.BARN
			}),
			width: z.coerce.number().positive().openapi({
				description: 'Filter by width of the building.',
				example: 12.0
			}),
			length: z.coerce.number().positive().openapi({
				description: 'Filter by length of the building.',
				example: 20.0
			}),
			height: z.coerce.number().positive().openapi({
				description: 'Filter by height of the building.',
				example: 10.0
			}),
			bedrooms: z.coerce.number().int().nonnegative().openapi({
				description: 'Filter by number of bedrooms.',
				example: 4
			}),
			bathrooms: z.coerce.number().int().nonnegative().openapi({
				description: 'Filter by number of bathrooms.',
				example: 3
			}),
			floors: z.coerce.number().int().positive().openapi({
				description: 'Filter by number of floors.',
				example: 3
			}),
			veranda: z.coerce.boolean().openapi({
				description: 'Filter by presence of veranda.',
				example: false
			})
		})
		.partial()
		.optional(),
	sort: z
		.object({
			field: z.enum(BuildingSortableFields).openapi({
				description: 'The field to sort by.',
				example: BuildingSortableFields.CREATED_AT
			}),
			order: z.enum(SortDirection).openapi({
				description: 'The sort order (ascending or descending).',
				example: SortDirection.ASC
			})
		})
		.partial()
		.optional(),
	pagination: z
		.object({
			offset: z.coerce.number().int().nonnegative().openapi({
				description: 'The offset for pagination.',
				example: 0
			}),
			limit: z.coerce.number().int().positive().openapi({
				description: 'The number of items per page for pagination.',
				example: 10
			})
		})
		.partial()
		.optional()
});

export type BuildingQueryOptionsDto = z.infer<typeof buildingQueryOptionsDtoSchema>;
