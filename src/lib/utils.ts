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
		case FinishType.ALL_YEAR_150:
			return 'ПМЖ 150мм';
		case FinishType.ALL_YEAR_200:
			return 'ПМЖ 200мм';
	}
}

export const prettyPrice = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'rub'
});

export function getTabIcon(type: FinishType) {
	switch (type) {
		case FinishType.COLD:
			return 'hugeicons:thermometer-cold';
		case FinishType.WARM:
			return 'hugeicons:thermometer-warm';
		case FinishType.ALL_YEAR:
			return 'lsicon:house-outline';
		case FinishType.ALL_YEAR_150:
			return 'lsicon:house-outline';
		case FinishType.ALL_YEAR_200:
			return 'lsicon:house-outline';
	}
}
