import type { ConstructionType } from '$lib/types/buildings/building.domain.types';
import {
	DeletedEntityModificationError,
	EntityAlreadyDeletedError,
	NegativeValueError,
	NonPositiveValueError
} from '../common/errors/errors.domain';
import { v7 as uuidv7 } from 'uuid';
import type { UserId } from '../users/user.domain';
import { Finish, FinishId } from '../finishes/finish.domain';
import type {
	UpdateBuildingParams,
	UpdateFinishParams
} from '$lib/types/listings/listings.service.types';

export class BuildingId {
	constructor(public readonly value: string) {}

	static create(): BuildingId {
		return new BuildingId(uuidv7());
	}
}

export class Building {
	private readonly _id: BuildingId;
	private _constructionType: ConstructionType;
	private _width: number;
	private _length: number;
	private _height: number;
	private _bedrooms: number;
	private _bathrooms: number;
	private _floors: number;
	private _hasVeranda: boolean;

	private _finishes: Finish[];

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: UserId;
	private _updatedById: UserId;
	private _deletedById: UserId | null;

	private constructor(params: {
		id: BuildingId;
		constructionType: ConstructionType;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		hasVeranda: boolean;
		finishes: Finish[];
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}) {
		this._id = params.id;
		this._constructionType = params.constructionType;
		this._width = params.width;
		this._length = params.length;
		this._height = params.height;
		this._bedrooms = params.bedrooms;
		this._bathrooms = params.bathrooms;
		this._floors = params.floors;
		this._hasVeranda = params.hasVeranda;
		this._finishes = params.finishes;

		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;

		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
		this._deletedById = params.deletedById;
	}

	static create(params: {
		constructionType: ConstructionType;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		hasVeranda: boolean;
		createdById: UserId;
		finishes?: Finish[];
	}): Building {
		const now = new Date();

		if (params.width <= 0) throw new NonPositiveValueError('width', params.width);
		if (params.length <= 0) throw new NonPositiveValueError('length', params.length);
		if (params.height <= 0) throw new NonPositiveValueError('height', params.height);
		if (params.bedrooms < 0) throw new NegativeValueError('bedrooms', params.bedrooms);
		if (params.bathrooms < 0) throw new NegativeValueError('bathrooms', params.bathrooms);
		if (params.floors <= 0) throw new NonPositiveValueError('floors', params.floors);

		return new Building({
			id: BuildingId.create(),
			constructionType: params.constructionType,
			width: params.width,
			length: params.length,
			height: params.height,
			bedrooms: params.bedrooms,
			bathrooms: params.bathrooms,
			floors: params.floors,
			hasVeranda: params.hasVeranda,
			finishes: params.finishes ?? [],
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
		});
	}

	static fromPersistence(params: {
		id: BuildingId;
		constructionType: ConstructionType;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		hasVeranda: boolean;
		finishes: Finish[];
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}): Building {
		return new Building(params);
	}

	get id() {
		return this._id;
	}

	get constructionType() {
		return this._constructionType;
	}

	get width() {
		return this._width;
	}

	get length() {
		return this._length;
	}

	get height() {
		return this._height;
	}

	get bedrooms() {
		return this._bedrooms;
	}

	get bathrooms() {
		return this._bathrooms;
	}

	get floors() {
		return this._floors;
	}

	get finishes() {
		return this._finishes;
	}

	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	get deletedAt() {
		return this._deletedAt;
	}

	get createdById() {
		return this._createdById;
	}

	get updatedById() {
		return this._updatedById;
	}

	get deletedById() {
		return this._deletedById;
	}

	get hasVeranda() {
		return this._hasVeranda;
	}

	get isDeleted() {
		return this._deletedAt !== null;
	}

	private get entityName() {
		return 'Building';
	}

	update(params: UpdateBuildingParams, updatedById: UserId): void {
		if (params.finishes) this.reconcileFinishes(params.finishes, updatedById);
		if (params.constructionType) this.changeConstructionType(params.constructionType, updatedById);
		if (params.width !== undefined) this.changeWidth(params.width, updatedById);
		if (params.length !== undefined) this.changeLength(params.length, updatedById);
		if (params.height !== undefined) this.changeHeight(params.height, updatedById);
		if (params.bedrooms !== undefined) this.changeBedrooms(params.bedrooms, updatedById);
		if (params.bathrooms !== undefined) this.changeBathrooms(params.bathrooms, updatedById);
		if (params.floors !== undefined) this.changeFloors(params.floors, updatedById);
		if (params.hasVeranda !== undefined) this.changeVeranda(params.hasVeranda, updatedById);
	}

	reconcileFinishes(finishUpdates: UpdateFinishParams[], performedById: UserId) {
		const updatedFinishes = this.finishes.filter((f) =>
			finishUpdates.some((u) => u.id && f.id.equals(u.id))
		);

		for (const update of finishUpdates) {
			if (!update.id) {
				updatedFinishes.push(
					Finish.create({
						type: update.type,
						description: update.description!,
						price: update.price!,
						originalPrice: update.originalPrice,
						createdById: performedById
					})
				);
			}
		}

		const updatesById = new Map(
			finishUpdates
				.filter((u): u is UpdateFinishParams & { id: FinishId } => !!u.id)
				.map((u) => [u.id.value, u])
		);

		for (const finish of updatedFinishes) {
			const update = updatesById.get(finish.id.value);
			if (update) {
				finish.update(update, performedById);
			}
		}

		this._finishes = updatedFinishes;

		this.markUpdated(performedById);
	}

	changeConstructionType(newType: ConstructionType, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this._constructionType = newType;
		this.markUpdated(updatedById);
	}

	changeWidth(newWidth: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePossitive(newWidth, 'width');
		this._width = newWidth;
		this.markUpdated(updatedById);
	}

	changeLength(newLength: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePossitive(newLength, 'length');
		this._length = newLength;
		this.markUpdated(updatedById);
	}

	changeHeight(newHeight: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePossitive(newHeight, 'height');
		this._height = newHeight;
		this.markUpdated(updatedById);
	}

	changeBedrooms(newBedrooms: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);
		this.validateNonNegative(newBedrooms, 'bedrooms');
		this._bedrooms = newBedrooms;
		this.markUpdated(updatedById);
	}

	changeBathrooms(newBathrooms: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateNonNegative(newBathrooms, 'bathrooms');
		this._bathrooms = newBathrooms;
		this.markUpdated(updatedById);
	}

	changeFloors(newFloors: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validatePossitive(newFloors, 'floors');
		this._floors = newFloors;
		this.markUpdated(updatedById);
	}

	changeVeranda(hasVeranda: boolean, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this._hasVeranda = hasVeranda;
		this.markUpdated(updatedById);
	}

	markDeleted(deletedById: UserId) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);

		this._deletedAt = new Date();
		this._deletedById = deletedById;
	}

	private validatePossitive(value: number, fieldName: string) {
		if (value <= 0) {
			throw new NonPositiveValueError(fieldName, value);
		}
	}

	private validateNonNegative(value: number, fieldName: string) {
		if (value < 0) {
			throw new NegativeValueError(fieldName, value);
		}
	}

	private markUpdated(updatedById: UserId) {
		this._updatedAt = new Date();
		this._updatedById = updatedById;
	}
}
