import type z from 'zod';
import { ConstructionType } from './types/buildings/building.domain.types';
import { FinishType } from './types/finishes/finish.domain.types';

export class ServiceException extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = 'ServiceException';
	}
}

export function toCamelCase(str: string): string {
	return str.toLowerCase().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function createEnumRecord<T extends string, V>(values: T[], defaultValue: V): Record<T, V> {
	return Object.fromEntries(values.map((v) => [v, defaultValue])) as Record<T, V>;
}

export function getBuildingTypeName(type: ConstructionType): string {
	switch (type) {
		case ConstructionType.FRAME:
			return 'Каркасные дома';
		case ConstructionType.BARN:
			return 'Барнхаусы';
		case ConstructionType.CONTAINER:
			return 'Бытовки';
	}
}

export function getFinishTypeName(type: FinishType): string {
	switch (type) {
		case FinishType.COLD:
			return 'Холодный контур';
		case FinishType.WARM_100:
			return 'Теплый контур 100мм';
		case FinishType.WARM_150:
			return 'Теплый контур 150мм';
		case FinishType.WARM_200:
			return 'Теплый контур 200мм';
	}
}

export function zodErrorMessage(error: z.ZodError) {
	return error.issues
		.map((err) => {
			const path = err.path.length ? err.path.join('.') : 'value';
			return `${path}: ${err.message}`;
		})
		.join('; ');
}

export const prettyPrice = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'rub'
});

export function getTabIcon(type: FinishType): string {
	switch (type) {
		case FinishType.COLD:
			return 'fa-solid:thermometer-empty';
		case FinishType.WARM_100:
			return 'fa-solid:thermometer-quarter';
		case FinishType.WARM_150:
			return 'fa-solid:thermometer-three-quarters';
		case FinishType.WARM_200:
			return 'fa-solid:thermometer-full';
	}
}
