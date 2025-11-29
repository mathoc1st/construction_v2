import type z from 'zod';
import { BuildingType, FinishType, type ServiceError } from './types';

export class ServiceException extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = 'ServiceException';
	}
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

export function getBuildingTypeName(type: BuildingType): string {
	switch (type) {
		case BuildingType.FRAME:
			return 'Каркасные дома';
		case BuildingType.BARN:
			return 'Барнхаусы';
		case BuildingType.CONTAINER:
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

export function getTabIcon(type: FinishType) {
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
