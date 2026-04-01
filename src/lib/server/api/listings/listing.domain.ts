import path from 'path';
import {
	EmptyStringError,
	EntityAlreadyDeletedError,
	EntityMissingIdError,
	InvalidImageExtensionError,
	InvalidPathError
} from '../common/errors/errors.domain';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export class Listing {
	private _id: number | null;
	private _title: string;
	private _images: string[];
	private _views: number;

	private _buildingId: number;

	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private _createdById: number;
	private _updatedById: number;
	private _deletedById: number | null;

	private constructor(params: {
		id: number | null;
		title: string;
		images: string[];
		views: number;

		buildingId: number;

		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;

		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}) {
		this._id = params.id;
		this._title = params.title;
		this._images = params.images;
		this._views = params.views;
		this._buildingId = params.buildingId;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;
		this._createdById = params.createdById;
		this._updatedById = params.updatedById;
		this._deletedById = params.deletedById;
	}

	public static create(params: {
		title: string;
		images: string[];
		buildingId: number;
		createdById: number;
	}): Listing {
		const now = new Date();
		return new Listing({
			id: null,
			title: params.title,
			images: params.images,
			views: 0,
			buildingId: params.buildingId,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
			createdById: params.createdById,
			updatedById: params.createdById,
			deletedById: null
		});
	}

	public static fromPersistence(params: {
		id: number;
		title: string;
		images: string[];
		views: number;
		buildingId: number;

		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;

		createdById: number;
		updatedById: number;
		deletedById: number | null;
	}): Listing {
		return new Listing({
			id: params.id,
			title: params.title,
			images: params.images,
			views: params.views,
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

	get title(): string {
		return this._title;
	}

	get images(): string[] {
		return this._images;
	}

	get views(): number {
		return this._views;
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
		return 'Listing';
	}

	changeTitle(newTitle: string, updatedById: number) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id!);

		this.validateString('title', newTitle);
		this._title = newTitle;
		this.markUpdated(updatedById);
	}

	incrementViews() {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id!);

		this._views += 1;
	}

	changeImages(newImages: string[], updatedById: number) {
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id!);

		newImages.forEach((name, index) => {
			this.validateImage(name, index);
		});
		this._images = newImages;
		this.markUpdated(updatedById);
	}

	markDeleted(deletedById: number) {
		if (!this.id) throw new EntityMissingIdError(this.entityName);
		if (this.isDeleted) throw new EntityAlreadyDeletedError(this.entityName, this.id);

		this._deletedById = deletedById;
		this._deletedAt = new Date();
	}

	private validateImage(name: string, index: number) {
		this.validateString(`images[${index}]`, name);
		if (!this.isValidPath(name)) {
			throw new InvalidPathError(`images[${index}]`, name);
		}
		if (!this.hasImageExtension(name)) {
			throw new InvalidImageExtensionError(`images[${index}]`, name);
		}
	}

	private validateString(fieldName: string, str: string) {
		if (str.trim().length == 0) throw new EmptyStringError(fieldName);
	}

	private isValidPath(p: string): boolean {
		try {
			path.parse(p);
			return true;
		} catch {
			return false;
		}
	}

	private hasImageExtension(p: string): boolean {
		return IMAGE_EXTENSIONS.includes(path.extname(p).toLowerCase());
	}

	private markUpdated(updatedById: number) {
		this._updatedById = updatedById;
		this._updatedAt = new Date();
	}
}
