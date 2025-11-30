import z from 'zod';
import { BuildingType, FinishType } from '../../../prisma/src/generated/prisma/enums';
import type {
	createBuilding,
	getBuildingById,
	getBuildingsByType,
	updateBuilding
} from '$lib/server/db/queries/building';

export { BuildingType } from '../../../prisma/src/generated/prisma/enums';
export { FinishType } from '../../../prisma/src/generated/prisma/enums';
export type { FinishOption } from '../../../prisma/src/generated/prisma/client';
export type { Building as BuildingSchema } from '../../..//prisma/src/generated/prisma/client';
export type { Finish } from '../../../prisma/src/generated/prisma/client';
export type { Image } from '../../../prisma/src/generated/prisma/client';
export type { Building } from '../../../prisma/src/generated/prisma/client';

type PartialWithRequired<T, K extends keyof T> = { [P in K]-?: T[P] } & Partial<Omit<T, K>>;

export enum SortBy {
	PRICE_ASC = 'PRICE_ASC',
	PRICE_DESC = 'PRICE_DESC',
	POPULARITY_ASC = 'POPULARITY_ASC',
	POPULARITY_DESC = 'POPULARITY_DESC'
}

export type ImageDto = {
	file: File;
};

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export type GetBuildingsByTypeResponse = ApiResponse<GetBuildingsByTypeResult>;

export type HandlerResult<T> = {
	result?: T;
	error?: ServiceError;
};

export type ServiceError = {
	status: number;
	message: string;
};

export type GetBuildingsByTypeResult = Awaited<ReturnType<typeof getBuildingsByType>>;
export type AddBuildingResult = Awaited<ReturnType<typeof createBuilding>>;
export type UpdateBuildingResult = Awaited<ReturnType<typeof updateBuilding>>;
export type GetBuildingResult = Awaited<ReturnType<typeof getBuildingById>>;

export const buildingOptionsSchema = z.object({
	type: z.preprocess(
		(val) => (typeof val === 'string' ? val.toUpperCase() : val),
		z.enum(BuildingType)
	),
	page: z
		.string()
		.regex(/^\d+$/)
		.transform((val) => parseInt(val))
		.nullish(),
	limit: z
		.string()
		.regex(/^\d+$/)
		.transform((val) => parseInt(val))
		.nullish(),
	sortBy: z.enum(SortBy).nullish(),
	floors: z
		.array(
			z
				.string()
				.regex(/^\d+$/)
				.transform((v) => parseInt(v, 10))
		)
		.nullish(),
	finishes: z.array(z.enum(FinishType)).nullish(),
	sizes: z
		.array(
			z
				.string()
				.regex(/^\d+x\d+$/)
				.transform((str) => {
					const [l, w] = str.split('x').map(Number);
					return { length: l, width: w };
				})
		)
		.nullish(),
	veranda: z
		.string()
		.regex(/^(true|false|1|0)$/i)
		.transform((v) => v === 'true' || v === '1')
		.nullish()
});

export type ParsedBuildingOptions = z.infer<typeof buildingOptionsSchema>;

export const imageSchema = z.object({
	filename: z.string('Название картинки не является строкой!').nonempty()
});

export const finishOptionSchema = z.object({
	isAvailable: z.boolean('Присутствие не булево значение!'),
	description: z.string('Описание не является строкой!')
});

export const finishSchema = z.object({
	type: z.enum(FinishType),
	price: z.number('Цена не является числом!').min(1, 'Цена обязательна!'),
	oldPrice: z.number('Старая цена не является числом!').optional().nullable(),
	options: z
		.array(finishOptionSchema)
		.nonempty('Должна присутствовать хотябы одна опция в комплектации!')
});

export const buildingSchema = z.object({
	type: z.enum(BuildingType),
	name: z
		.string('Название не является строкой!')
		.nonempty('Поле "название" не должно быть пустым!'),
	width: z.number('Ширина не является числом!').min(1, 'Ширина обязательна!'),
	length: z.number('Длина не является числом!').min(1, 'Длина обязательна!'),
	bedrooms: z.number('Комнаты не является числом!').min(1, 'Количество комнат обязательно!'),
	bathrooms: z.number('Санузлы не является числом!').min(1, 'Количество санузлов обязательно!'),
	floors: z.number('Эажность не является числом!').min(1, 'Этажность обязательна!'),
	veranda: z.boolean('Веранда не является булевым значение!')
	// finishes: z.array(finishSchema),
	// images: z.array(imageSchema)
});

export type ParsedBuilding = z.infer<typeof buildingSchema>;
export type BuildingDto = Partial<ParsedBuilding>;

export type ParsedFinish = z.infer<typeof finishSchema>;
export type FinishDto = PartialWithRequired<ParsedFinish, 'type'>;

export type FinishOptionDto = z.infer<typeof finishOptionSchema>;
