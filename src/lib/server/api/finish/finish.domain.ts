import { EmptyStringError, NonPositiveValueError } from '../common/errors/errors.domain';

export enum FinishType {
	COLD = 'COLD',
	WARM_100 = 'WARM_100',
	WARM_150 = 'WARM_150',
	WARM_200 = 'WARM_200'
}

export class Finish {
	private _id: number | null;
	private _type: FinishType;
	private _description: string;
	private _price: number;
	private _originalPrice: number | null;

	private _buildingId: number | null;

	private _createdAt: Date;
	private _updatedAt: Date;

	private _createdById: number;
	private _updatedById: number;

	private constructor(params: {
		id: number | null;
		type: FinishType;
		description: string;
		price: number;
		originalPrice: number | null;
		buildingId: number | null;
		createdAt: Date;
		updatedAt: Date;
		createdById: number;
		updatedById: number;
	}) {
		this._id = params.id;
		this._type = params.type;
		this._description = params.description;
		this._price = params.price;
		this._originalPrice = params.originalPrice;
		this._buildingId = params.buildingId;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
	}

	static create(params: {
		type: FinishType;
		description: string;
		price: number;
		originalPrice?: number;
		createdById: number;
	}): Finish {
		const now = new Date();
		return new Finish({
			id: null,
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice ?? null,
			buildingId: null,
			createdAt: now,
			updatedAt: now,
			createdById: params.createdById,
			updatedById: params.createdById
		});
	}

	static fromPersistence(params: {
		id: number;
		type: FinishType;
		description: string;
		price: number;
		originalPrice: number | null;
		buildingId: number;
		createdAt: Date;
		updatedAt: Date;
		createdById: number;
		updatedById: number;
	}): Finish {
		return new Finish({
			id: params.id,
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice,
			buildingId: params.buildingId,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt,
			createdById: params.createdById,
			updatedById: params.updatedById
		});
	}

	get id(): number | null {
		return this._id;
	}

	get type(): FinishType {
		return this._type;
	}

	get description(): string {
		return this._description;
	}

	get price(): number {
		return this._price;
	}

	get originalPrice(): number | null {
		return this._originalPrice;
	}

	get buildingId(): number | null {
		return this._buildingId;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get createdById(): number {
		return this._createdById;
	}

	get updatedById(): number {
		return this._updatedById;
	}

	changeType(type: FinishType, updatedById: number): void {
		this._type = type;
		this.markUpdated(updatedById);
	}

	changeDescription(description: string, updatedById: number): void {
		this.validateString('Description', description);
		this._description = description;
		this.markUpdated(updatedById);
	}

	changePrice(price: number, updatedById: number): void {
		this.validatePrice(price);

		this._price = price;
		this.markUpdated(updatedById);
	}

	changeOriginalPrice(originalPrice: number, updatedById: number): void {
		this.validatePrice(originalPrice);

		this._originalPrice = originalPrice;
		this.markUpdated(updatedById);
	}

	private validatePrice(price: number) {
		if (price <= 0) {
			throw new NonPositiveValueError('price', price);
		}
	}

	private validateString(fieldName: string, str: string) {
		if (str.trim().length == 0) throw new EmptyStringError(fieldName);
	}

	private markUpdated(updatedById: number): void {
		this._updatedAt = new Date();
		this._updatedById = updatedById;
	}
}
