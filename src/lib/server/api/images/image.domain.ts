import { ImageStatus } from '$lib/types/images/image.domain.types';
import { v7 as uuidv7 } from 'uuid';
import { EmptyStringError } from '../common/errors/errors.domain';
import type { UserId } from '../users/user.domain';

export const IMAGE_BUCKET_NAME = 'images';
export const TEMP_IMAGE_FOLDER = 'temp';
export const ACTIVE_IMAGE_FOLDER = 'active';
export const DELETED_IMAGE_FOLDER = 'deleted';

export class ImageId {
	constructor(public readonly value: string) {}

	static create(): ImageId {
		return new ImageId(uuidv7());
	}
}

export class Image {
	private readonly _id: ImageId;
	private _folder: string;
	private _key: string;
	private _bucket: string;
	private _status: ImageStatus;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: UserId;
	private _updatedById: UserId;
	private _deletedById: UserId | null;

	private constructor(params: {
		id: ImageId;
		folder: string;
		key: string;
		bucket: string;
		status: ImageStatus;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}) {
		this._id = params.id;
		this._folder = params.folder;
		this._key = params.key;
		this._bucket = params.bucket;
		this._status = params.status;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;
		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
		this._deletedById = params.deletedById;
	}

	static create(params: {
		folder: string;
		key: string;
		bucket: string;
		createdById: UserId;
	}): Image {
		if (!params.key || params.key.trim() === '') throw new EmptyStringError('Filename');
		if (!params.folder || params.folder.trim() === '') throw new EmptyStringError('Folder');
		if (!params.bucket || params.bucket.trim() === '') throw new EmptyStringError('Bucket');

		const now = new Date();

		return new Image({
			id: ImageId.create(),
			folder: params.folder,
			key: params.key,
			bucket: params.bucket,
			status: ImageStatus.TEMP,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
		});
	}

	static fromPersistence(params: {
		id: string;
		folder: string;
		key: string;
		bucket: string;
		status: ImageStatus;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		createdById: UserId;
		updatedById: UserId;
		deletedById: UserId | null;
	}): Image {
		return new Image({
			id: new ImageId(params.id),
			folder: params.folder,
			key: params.key,
			bucket: params.bucket,
			status: params.status,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt,
			deletedAt: params.deletedAt,
			createdById: params.createdById,
			updatedById: params.updatedById,
			deletedById: params.deletedById
		});
	}

	get id(): ImageId {
		return this._id;
	}

	get folder(): string {
		return this._folder;
	}

	get key(): string {
		return this._key;
	}

	get bucket(): string {
		return this._bucket;
	}

	get status(): ImageStatus {
		return this._status;
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

	markActive(updatedById: UserId) {
		if (this.isDeleted) throw new Error('Cannot mark a deleted image as active');

		this.changeFolder('active');
		this.changeStatus(ImageStatus.ACTIVE);

		this._updatedAt = new Date();
		this._updatedById = updatedById;
	}

	markDeleted(deletedById: UserId) {
		if (this.isDeleted) throw new Error('Image is already deleted');

		this.changeFolder('deleted');
		this.changeStatus(ImageStatus.DELETED);

		this._deletedAt = new Date();
		this._deletedById = deletedById;
	}

	private changeFolder(newFolder: string) {
		if (this.isDeleted) throw new Error('Cannot change folder of a deleted image');
		if (!newFolder || newFolder.trim() === '') throw new EmptyStringError('Folder');

		this._folder = newFolder;
	}

	private changeStatus(newStatus: ImageStatus) {
		if (this.isDeleted) throw new Error('Cannot change status of a deleted image');
		this._status = newStatus;
	}
}
