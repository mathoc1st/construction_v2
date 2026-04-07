import type z from 'zod';
import type { ConstructionType } from './server/api/buildings/building.types';
import type { FinishType } from './server/api/finishes/finish.types';
import type { ServiceError } from './server/api/common/errors/errors.service';

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

export function toServiceError(err: unknown): ServiceError {
	// If it is already a ServiceException → pass it through
	if (err instanceof ServiceException) {
		return { status: err.status, message: err.message };
	}

	// If it's a normal Error
	if (err instanceof Error) {
		return { status: 500, message: err.message };
	}

	// Something unknown (string thrown, object thrown, etc.)
	return { status: 500, message: String(err) };
}

export function getBuildingTypeName(type: ConstructionType): string {
	switch (type) {
		case 'FRAME':
			return 'Каркасные дома';
		case 'BARN':
			return 'Барнхаусы';
		case 'CONTAINER':
			return 'Бытовки';
	}
}

export function getFinishTypeName(type: FinishType): string {
	switch (type) {
		case 'COLD':
			return 'Холодный контур';
		case 'WARM_100':
			return 'Теплый контур 100мм';
		case 'WARM_150':
			return 'Теплый контур 150мм';
		case 'WARM_200':
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

export function getTabIcon(type: FinishType) {
	switch (type) {
		case 'COLD':
			return 'fa-solid:thermometer-empty';
		case 'WARM_100':
			return 'fa-solid:thermometer-quarter';
		case 'WARM_150':
			return 'fa-solid:thermometer-three-quarters';
		case 'WARM_200':
			return 'fa-solid:thermometer-full';
	}
}
