import type { ConstructionType } from '$lib/types/buildings/building.domain.types';
import {
	DeletedEntityModificationError,
	EntityAlreadyDeletedError,
	NonPositiveValueError
} from '../common/errors/errors.domain';
import { v7 as uuidv7 } from 'uuid';
import type { UserId } from '../users/user.domain';
import type { UpdateBuildingParams } from '$lib/types/buildings/buildings.service.types';
import { Finish } from '../finishes/finish.domain';
import type { UpdateFinishParams } from '$lib/types/finishes/finishes.service.types';

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
		if (params.bedrooms < 0) throw new NonPositiveValueError('bedrooms', params.bedrooms);
		if (params.bathrooms < 0) throw new NonPositiveValueError('bathrooms', params.bathrooms);
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
		const existingFinishIds = this.finishes.map((f) => f.id);
		const incomingFinishIds = finishUpdates.map((f) => f.id);

		const existingSet = new Set(existingFinishIds);
		const incomingSet = new Set(incomingFinishIds);

		const filteredFinishes = this.finishes.filter((f) => incomingSet.has(f.id));

		const toAdd = finishUpdates.filter((f) => !f.id);

		for (const finish of toAdd) {
			filteredFinishes.push(
				Finish.create({
					type: finish.type,
					description: finish.description!,
					price: finish.price!,
					originalPrice: finish.originalPrice,
					createdById: performedById
				})
			);
		}

		const toUpdate = finishUpdates.filter((f) => f.id && existingSet.has(f.id));

		for (const update of toUpdate) {
			for (const finish of filteredFinishes) {
				if (finish.id !== update.id) continue;
				finish.update(update, performedById);
			}
		}

		this._finishes = filteredFinishes;
	}

	changeConstructionType(newType: ConstructionType, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this._constructionType = newType;
		this.markUpdated(updatedById);
	}

	changeWidth(newWidth: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateDimension(newWidth);
		this._width = newWidth;
		this.markUpdated(updatedById);
	}

	changeLength(newLength: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateDimension(newLength);
		this._length = newLength;
		this.markUpdated(updatedById);
	}

	changeHeight(newHeight: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateDimension(newHeight);
		this._height = newHeight;
		this.markUpdated(updatedById);
	}

	changeBedrooms(newBedrooms: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);
		this.validateDimension(newBedrooms);
		this._bedrooms = newBedrooms;
		this.markUpdated(updatedById);
	}

	changeBathrooms(newBathrooms: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateDimension(newBathrooms);
		this._bathrooms = newBathrooms;
		this.markUpdated(updatedById);
	}

	changeFloors(newFloors: number, updatedById: UserId) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName);

		this.validateDimension(newFloors);
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

	private validateDimension(dimension: number) {
		if (dimension <= 0) {
			throw new NonPositiveValueError('dimension', dimension);
		}
	}

	private markUpdated(updatedById: UserId) {
		this._updatedAt = new Date();
		this._updatedById = updatedById;
	}
}
