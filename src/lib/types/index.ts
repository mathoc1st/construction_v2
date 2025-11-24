import z from 'zod';
import { BuildingType, FinishType } from '../../../prisma/src/generated/prisma/enums';

export { BuildingType } from '../../../prisma/src/generated/prisma/enums';
export { FinishType } from '../../../prisma/src/generated/prisma/enums';
export type { FinishOption } from '../../../prisma/src/generated/prisma/client';

export enum SortBy {
	PRICE_ASC = 'PRICE_ASC',
	PRICE_DESC = 'PRICE_DESC',
	POPULARITY_ASC = 'POPULARITY_ASC',
	POPULARITY_DESC = 'POPULARITY_DESC'
}

export type FinishOptionDto = {
	isAvailable: boolean;
	description: string;
};

export type FinishDto = {
	type: FinishType;
	oldPrice?: number;
	price: number;
	options: FinishOptionDto[];
};

export const createBuildingSchema = z.object({
	type: z.enum(BuildingType),
	name: z
		.string('Название не является строкой!')
		.nonempty('Поле "название" не должно быть пустым!'),
	width: z.coerce.number('Ширина не является числом!').min(1, 'Ширина обязательна!'),
	length: z.coerce.number('Длина не является числом!').min(1, 'Длина обязательна!'),
	bedrooms: z.coerce.number('Комнаты не является числом!').min(1, 'Количество комнат обязательно!'),
	bathrooms: z.coerce
		.number('Санузлы не является числом!')
		.min(1, 'Количество санузлов обязательно!'),
	floors: z.coerce.number('Эажность не является числом!').min(1, 'Этажность обязательна!'),
	veranda: z.boolean('Веранда не является булевым значение!')
});

export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;

export const createImageSchema = z.object({
	filename: z.string('Название картинки не является строкой!').nonempty(),
	isMain: z.boolean('Главное изображение не булево значение!')
});

export type CreateImageDto = z.infer<typeof createImageSchema>;

export const createOptionSchema = z.object({
	isAvailable: z.boolean('Присутствие не булево значение!'),
	description: z.string('Описание не является строкой!')
});

export type CreateOptionDto = z.infer<typeof createOptionSchema>;

export const createFinishSchema = z.object({
	type: z.enum(FinishType),
	price: z.coerce.number('Цена не является числом!').min(1, 'Цена обязательна!'),
	oldPrice: z.coerce.number('Старая цена не является числом!').optional(),
	options: z.array(createOptionSchema)
});

export type CreateFinishDto = z.infer<typeof createFinishSchema>;
