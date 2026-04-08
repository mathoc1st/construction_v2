export enum FinishType {
	COLD = 'COLD',
	WARM_100 = 'WARM_100',
	WARM_150 = 'WARM_150',
	WARM_200 = 'WARM_200'
}

export type FinishPersistence = {
	id: string;
	type: FinishType;
	price: number;
	originalPrice: number | null;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;

	createdById: string;
	updatedById: string;
	deletedById: string | null;
};
