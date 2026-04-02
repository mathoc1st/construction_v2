import {
	DeletedEntityModificationError,
	EmptyStringError,
	EntityAlreadyDeletedError,
	EntityMissingIdError,
	NonPositiveValueError
} from '../common/errors/errors.domain';
import type { FinishType } from './finish.types';

export class Finish {
	private _id: number | null;
	private _type: FinishType;
	private _description: string;
	private _price: number;
	private _originalPrice: number | null;

	private _buildingId: number;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: number;
	private _updatedById: number;
	private _deletedById: number | null;

	private constructor(params: {
		id: number | null;
		type: FinishType;
		description: string;
		price: number;
		originalPrice: number | null;
		buildingId: number;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}) {
		this._id = params.id;
		this._type = params.type;
		this._description = params.description;
		this._price = params.price;
		this._originalPrice = params.originalPrice;
		this._buildingId = params.buildingId;
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
		originalPrice?: number;
		createdById: number;
		buildingId: number;
	}): Finish {
		if (!params.description || params.description.trim() === '')
			throw new EmptyStringError('Description');

		if (params.price <= 0) throw new NonPositiveValueError('Price', params.price);

		if (params.originalPrice !== undefined && params.originalPrice <= 0)
			throw new NonPositiveValueError('Original Price', params.originalPrice);

		const now = new Date();
		return new Finish({
			id: null,
			type: params.type,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice ?? null,
			buildingId: params.buildingId,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
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
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
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
			deletedAt: params.deletedAt,
			createdById: params.createdById,
			updatedById: params.updatedById,
			deletedById: params.deletedById
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

	get buildingId(): number {
		return this._buildingId;
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
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this._type = type;
		this.markUpdated(updatedById);
	}

	changeDescription(description: string, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateString('Description', description);
		this._description = description;
		this.markUpdated(updatedById);
	}

	changePrice(price: number, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validatePrice(price);

		this._price = price;
		this.markUpdated(updatedById);
	}

	changeOriginalPrice(originalPrice: number, updatedById: number): void {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validatePrice(originalPrice);

		this._originalPrice = originalPrice;
		this.markUpdated(updatedById);
	}

	markDeleted(deletedById: number) {
		if (!this.id) throw new EntityMissingIdError(this.entityName);
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id);

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
