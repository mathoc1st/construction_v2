import type { FinishType } from '$lib/types/finishes/finish.domain.types';
import {
	DeletedEntityModificationError,
	EmptyStringError,
	EntityAlreadyDeletedError,
	NonPositiveValueError
} from '../common/errors/errors.domain';

export class Finish {
	private _type: FinishType;
	private _description: string;
	private _price: number;
	private _originalPrice: number | null;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: number;
	private _updatedById: number;
	private _deletedById: number | null;

	private constructor(params: {
		type: FinishType;
		description: string;
		price: number;
		originalPrice: number | null;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}) {
		this._type = params.type;
		this._description = params.description;
		this._price = params.price;
		this._originalPrice = params.originalPrice;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;
		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
		this._deletedById = params.deletedById;
	}

	static create(params: {
		type: FinishType;
		description: string;
		price: number;
		originalPrice?: number | null;
		createdById: number;
	}): Finish {
		if (!params.description || params.description.trim() === '')
			throw new EmptyStringError('Description');

		if (params.price <= 0) throw new NonPositiveValueError('Price', params.price);

		if (params.originalPrice != null && params.originalPrice <= 0)
			throw new NonPositiveValueError('Original Price', params.originalPrice);

		const now = new Date();
		return new Finish({
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice ?? null,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
		});
	}

	static fromPersistence(params: {
		type: FinishType;
		description: string;
		price: number;
		originalPrice: number | null;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}): Finish {
		return new Finish({
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt,
			deletedAt: params.deletedAt,
			createdById: params.createdById,
			updatedById: params.updatedById,
			deletedById: params.deletedById
		});
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

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get deletedAt(): Date | null {
		return this._deletedAt;
	}

	get createdById(): number {
		return this._createdById;
	}

	get updatedById(): number {
		return this._updatedById;
	}

	get deletedById(): number | null {
		return this._deletedById;
	}

	get isDeleted(): boolean {
		return this._deletedAt !== null;
	}

	private get entityName() {
		return 'Finish';
	}

	changeType(type: FinishType, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this._type = type;
		this.markUpdated(updatedById);
	}

	changeDescription(description: string, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateString('Description', description);
		this._description = description;
		this.markUpdated(updatedById);
	}

	changePrice(price: number, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePrice(price);

		this._price = price;
		this.markUpdated(updatedById);
	}

	changeOriginalPrice(originalPrice: number, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePrice(originalPrice);

		this._originalPrice = originalPrice;
		this.markUpdated(updatedById);
	}

	markDeleted(deletedById: number) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);

		this._deletedAt = new Date();
		this._deletedById = deletedById;
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
