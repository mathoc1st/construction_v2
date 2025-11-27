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
		case FinishType.WARM_100:
			return 'Теплый контур 100мм';
		case FinishType.WARM_150:
			return 'Теплый контур 15мм';
		case FinishType.WARM_200:
			return 'Теплый контур 200мм';
	}
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
