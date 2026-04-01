import {
	DeletedEntityModificationError,
	DomainError,
	EntityAlreadyDeletedError,
	EntityMissingIdError,
	NonPositiveValueError
} from '../common/errors/errors.domain';

export class BuildingAlreadyDeletedError extends DomainError {
	constructor(id: number) {
		super(`Building with ID ${id} has already been deleted`);
		this.name = 'BuildingAlreadyDeletedError';
	}
}

export enum ConstructionType {
	FRAME = 'FRAME',
	BARN = 'BARN',
	CONTAINER = 'CONTAINER'
}

export class Building {
	private _id: number | null;
	private _constructionType: ConstructionType;
	private _width: number;
	private _length: number;
	private _height: number;
	private _bedrooms: number;
	private _bathrooms: number;
	private _floors: number;
	private _veranda: boolean;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: number;
	private _updatedById: number;
	private _deletedById: number | null;

	private constructor(params: {
		id: number | null;
		constructionType: ConstructionType;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		veranda: boolean;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}) {
		this._id = params.id;
		this._constructionType = params.constructionType;
		this._width = params.width;
		this._length = params.length;
		this._height = params.height;
		this._bedrooms = params.bedrooms;
		this._bathrooms = params.bathrooms;
		this._floors = params.floors;
		this._veranda = params.veranda;

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
		veranda: boolean;
		createdById: number;
	}): Building {
		const now = new Date();
		return new Building({
			id: null,
			constructionType: params.constructionType,
			width: params.width,
			length: params.length,
			height: params.height,
			bedrooms: params.bedrooms,
			bathrooms: params.bathrooms,
			floors: params.floors,
			veranda: params.veranda,
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
		constructionType: ConstructionType;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		veranda: boolean;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: number;
		updatedById: number;
		deletedById: number | null;
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

	get veranda() {
		return this._veranda;
	}

	get isDeleted() {
		return this._deletedAt !== null;
	}

	private get entityName() {
		return 'Building';
	}

	changeConstructionType(newType: ConstructionType, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this._constructionType = newType;
		this.markUpdated(updatedById);
	}

	changeWidth(newWidth: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateDimension(newWidth);
		this._width = newWidth;
		this.markUpdated(updatedById);
	}

	changeLength(newLength: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateDimension(newLength);
		this._length = newLength;
		this.markUpdated(updatedById);
	}

	changeHeight(newHeight: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateDimension(newHeight);
		this._height = newHeight;
		this.markUpdated(updatedById);
	}

	changeBedrooms(newBedrooms: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);
		this.validateDimension(newBedrooms);
		this._bedrooms = newBedrooms;
		this.markUpdated(updatedById);
	}

	changeBathrooms(newBathrooms: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateDimension(newBathrooms);
		this._bathrooms = newBathrooms;
		this.markUpdated(updatedById);
	}

	changeFloors(newFloors: number, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this.validateDimension(newFloors);
		this._floors = newFloors;
		this.markUpdated(updatedById);
	}

	changeVeranda(hasVeranda: boolean, updatedById: number) {
		if (this.isDeleted) throw new DeletedEntityModificationError(this.entityName, this.id!);

		this._veranda = hasVeranda;
		this.markUpdated(updatedById);
	}

	markDeleted(deletedById: number) {
		if (!this.id) throw new EntityMissingIdError(this.entityName);
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id);

		this._deletedAt = new Date();
		this._deletedById = deletedById;
	}

	private validateDimension(dimension: number) {
		if (dimension <= 0) {
			throw new NonPositiveValueError('dimension', dimension);
		}
	}

	private markUpdated(updatedById: number) {
		this._updatedAt = new Date();
		this._updatedById = updatedById;
	}
}
