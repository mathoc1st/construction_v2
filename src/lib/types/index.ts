import z from 'zod';
import { BuildingType, FinishType } from '../../../prisma/src/generated/prisma/enums';

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
