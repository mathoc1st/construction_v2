import { NonPositiveValueError } from '../common/errors/errors.domain';

export enum ConstructionType {
	FRAME = 'FRAME',
	BARN = 'BARN',
	CONTAINER = 'CONTAINER'
}

export enum OutsideFinish {
	COLD = 'COLD',
	WARM_100 = 'WARM_100',
	WARM_150 = 'WARM_150',
	WARM_200 = 'WARM_200'
}

export class Building {
	private _id: number | null;
	private _constructionType: ConstructionType;
	private _outsideFinishes: Set<OutsideFinish>;
	private _width: number;
	private _length: number;
	private _height: number;
	private _bedrooms: number;
	private _bathrooms: number;
	private _floors: number;
	private _veranda: boolean;

	private _createdAt: Date;
	private _updatedAt: Date | null;
	private _deletedAt: Date | null;

	private _createdByUserId: number;
	private _updatedByUserId: number | null;
	private _deletedByUserId: number | null;

	private constructor(params: {
		id: number | null;
		constructionType: ConstructionType;
		outsideFinishes: Set<OutsideFinish>;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		veranda: boolean;
		createdAt: Date;
		updatedAt: Date | null;
		deletedAt: Date | null;
		createdByUserId: number;
		updatedByUserId: number | null;
		deletedByUserId: number | null;
	}) {
		this._id = params.id;
		this._constructionType = params.constructionType;
		this._outsideFinishes = new Set(params.outsideFinishes);
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

		this._createdByUserId = params.createdByUserId;
		this._updatedByUserId = params.updatedByUserId;
		this._deletedByUserId = params.deletedByUserId;
	}

	static create(params: {
		constructionType: ConstructionType;
		outsideFinishes: Set<OutsideFinish>;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		veranda: boolean;
		createdByUserId: number;
	}): Building {
		const now = new Date();
		return new Building({
			id: null,
			constructionType: params.constructionType,
			outsideFinishes: params.outsideFinishes,
			width: params.width,
			length: params.length,
			height: params.height,
			bedrooms: params.bedrooms,
			bathrooms: params.bathrooms,
			floors: params.floors,
			veranda: params.veranda,
			createdAt: now,
			updatedAt: null,
			deletedAt: null,
			createdByUserId: params.createdByUserId,
			updatedByUserId: null,
			deletedByUserId: null
		});
	}

	static fromPersistence(params: {
		id: number;
		constructionType: ConstructionType;
		outsideFinishes: Set<OutsideFinish>;
		width: number;
		length: number;
		height: number;
		bedrooms: number;
		bathrooms: number;
		floors: number;
		veranda: boolean;
		createdAt: Date;
		updatedAt: Date | null;
		deletedAt: Date | null;
		createdByUserId: number;
		updatedByUserId: number | null;
		deletedByUserId: number | null;
	}): Building {
		return new Building(params);
	}

	get id() {
		return this._id;
	}

	get constructionType() {
		return this._constructionType;
	}

	get outsideFinishes() {
		return this._outsideFinishes;
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

	get createdByUserId() {
		return this._createdByUserId;
	}

	get updatedByUserId() {
		return this._updatedByUserId;
	}

	get deletedByUserId() {
		return this._deletedByUserId;
	}

	get hasVeranda() {
		return this._veranda;
	}

	get isDeleted() {
		return this._deletedAt !== null;
	}

	changeType(newType: ConstructionType, updatedByUserId: number) {
		this._constructionType = newType;
		this.markUpdated(updatedByUserId);
	}

	changeOutsideFinish(newOutsideFinish: OutsideFinish, updatedByUserId: number) {
		this._outsideFinishes = new Set([newOutsideFinish]);
		this.markUpdated(updatedByUserId);
	}

	changeWidth(newWidth: number, updatedByUserId: number) {
		this.validateDimension(newWidth);
		this._width = newWidth;
		this.markUpdated(updatedByUserId);
	}

	changeLength(newLength: number, updatedByUserId: number) {
		this.validateDimension(newLength);
		this._length = newLength;
		this.markUpdated(updatedByUserId);
	}

	changeHeight(newHeight: number, updatedByUserId: number) {
		this.validateDimension(newHeight);
		this._height = newHeight;
		this.markUpdated(updatedByUserId);
	}

	changeBedrooms(newBedrooms: number, updatedByUserId: number) {
		this.validateDimension(newBedrooms);
		this._bedrooms = newBedrooms;
		this.markUpdated(updatedByUserId);
	}

	changeBathrooms(newBathrooms: number, updatedByUserId: number) {
		this.validateDimension(newBathrooms);
		this._bathrooms = newBathrooms;
		this.markUpdated(updatedByUserId);
	}

	changeFloors(newFloors: number, updatedByUserId: number) {
		this.validateDimension(newFloors);
		this._floors = newFloors;
		this.markUpdated(updatedByUserId);
	}

	changeVeranda(hasVeranda: boolean, updatedByUserId: number) {
		this._veranda = hasVeranda;
		this.markUpdated(updatedByUserId);
	}

	markDeleted(deletedByUserId: number) {
		this._deletedAt = new Date();
		this._deletedByUserId = deletedByUserId;
	}

	private validateDimension(dimension: number) {
		if (dimension <= 0) {
			throw new NonPositiveValueError('dimension', dimension);
		}
	}

	private markUpdated(updatedByUserId: number) {
		this._updatedAt = new Date();
		this._updatedByUserId = updatedByUserId;
	}
}
