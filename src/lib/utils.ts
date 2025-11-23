import { BuildingType, FinishType } from './types';

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
		case FinishType.WARM:
			return 'Теплый контур';
		case FinishType.ALL_YEAR:
			return 'ПМЖ';
	}
}
