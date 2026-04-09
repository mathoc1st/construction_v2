import { EmptyStringError, EntityAlreadyDeletedError } from '../common/errors/errors.domain';
import { v7 as uuidv7 } from 'uuid';
import type { Building } from '../buildings/building.domain';
import type { UserId } from '../users/user.domain';
import type { UpdateListingParams } from '$lib/types/listings/listings.service.types';
import type { Image } from '../images/image.domain';

export class ListingId {
	constructor(public readonly value: string) {}

	static create(): ListingId {
		return new ListingId(uuidv7());
	}
}

export class Listing {
	private readonly _id: ListingId;
	private readonly _building: Building;
	private _title: string;
	private _images: Image[];
	private _views: number;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: UserId;
	private _updatedById: UserId;
	private _deletedById: UserId | null;

	private constructor(params: {
		id: ListingId;
		building: Building;
		title: string;
		images: Image[];
		views: number;

		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;

		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}) {
		this._id = params.id;
		this._building = params.building;
		this._title = params.title;
		this._images = params.images;
		this._views = params.views;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;
		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
		this._deletedById = params.deletedById;
	}

	public static create(params: {
		building: Building;
		title: string;
		images: Image[];
		createdById: UserId;
	}): Listing {
		if (!params.title || params.title.trim() === '') throw new EmptyStringError('Title');

		const now = new Date();
		return new Listing({
			id: ListingId.create(),
			building: params.building,
			title: params.title,
			images: params.images,
			views: 0,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
		});
	}

	public static fromPersistence(params: {
		id: ListingId;
		building: Building;
		title: string;
		images: Image[];
		views: number;

		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;

		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}): Listing {
		return new Listing({
			id: params.id,
			building: params.building,
			title: params.title,
			images: params.images,
			views: params.views,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt,
			deletedAt: params.deletedAt,
			createdById: params.createdById,
			updatedById: params.updatedById,
			deletedById: params.deletedById
		});
	}

	get id(): ListingId {
		return this._id;
	}

	get building(): Building {
		return this._building;
	}

	get title(): string {
		return this._title;
	}

	get images(): Image[] {
		return this._images;
	}

	get views(): number {
		return this._views;
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

	get createdById(): UserId {
		return this._createdById;
	}

	get updatedById(): UserId {
		return this._updatedById;
	}

	get deletedById(): UserId | null {
		return this._deletedById;
	}

	get isDeleted(): boolean {
		return this._deletedAt !== null;
	}

	private get entityName() {
		return 'Listing';
	}

	update(params: UpdateListingParams, updatedById: UserId) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);

		if (params.building) this._building.update(params.building, updatedById);
		if (params.title) this.changeTitle(params.title, updatedById);
	}

	changeTitle(newTitle: string, updatedById: UserId) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);

		this.validateString('title', newTitle);
		this._title = newTitle;
		this.markUpdated(updatedById);
	}

	incrementViews() {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);

		this._views += 1;
	}

	markDeleted(deletedById: UserId) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName);
		this.building.markDeleted(deletedById);

		this._deletedById = deletedById;
		this._deletedAt = new Date();
	}

	private validateString(fieldName: string, str: string) {
		if (str.trim().length == 0) throw new EmptyStringError(fieldName);
	}

	private markUpdated(updatedById: UserId) {
		this._updatedById = updatedById;
		this._updatedAt = new Date();
	}
}
