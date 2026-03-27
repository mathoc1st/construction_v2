import {
	EmptyStringError,
	InvalidUrlError,
	NonPositiveValueError
} from '../common/errors/errors.domain';

export class Listing {
	private _id: number | null;
	private _title: string;
	private _description: string;
	private _price: number;
	private _originalPrice: number | null;
	private _images: string[];
	private _views: number;

	private _createdAt: Date;
	private _updatedAt: Date | null;
	private _deletedAt: Date | null;

	private _createdByUserId: number;
	private _updatedByUserId: number | null;
	private _deletedByUserId: number | null;

	private constructor(params: {
		id: number | null;
		title: string;
		description: string;
		price: number;
		originalPrice: number | null;
		images: string[];
		views: number;

		createdAt: Date;
		updatedAt: Date | null;
		deletedAt: Date | null;

		createdByUserId: number;
		updatedByUserId: number | null;
		deletedByUserId: number | null;
	}) {
		this._id = params.id;
		this._title = params.title;
		this._description = params.description;
		this._price = params.price;
		this._originalPrice = params.originalPrice;
		this._images = params.images;
		this._views = params.views;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
		this._deletedAt = params.deletedAt;
		this._createdByUserId = params.createdByUserId;
		this._updatedByUserId = params.updatedByUserId;
		this._deletedByUserId = params.deletedByUserId;
	}

	public static create(params: {
		title: string;
		description: string;
		price: number;
		originalPrice?: number | null;
		images: string[];
		createdByUserId: number;
	}): Listing {
		const now = new Date();
		return new Listing({
			id: null,
			title: params.title,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice ?? null,
			images: params.images,
			views: 0,
			createdAt: now,
			updatedAt: null,
			deletedAt: null,
			createdByUserId: params.createdByUserId,
			updatedByUserId: null,
			deletedByUserId: null
		});
	}

	public static fromPersistence(params: {
		id: number;
		title: string;
		description: string;
		price: number;
		originalPrice: number | null;
		images: string[];
		views: number;

		createdAt: Date;
		updatedAt: Date | null;
		deletedAt: Date | null;

		createdByUserId: number;
		updatedByUserId: number | null;
		deletedByUserId: number | null;
	}): Listing {
		return new Listing({
			id: params.id,
			title: params.title,
			description: params.description,
			price: params.price,
			originalPrice: params.originalPrice,
			images: params.images,
			views: params.views,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt,
			deletedAt: params.deletedAt,
			createdByUserId: params.createdByUserId,
			updatedByUserId: params.updatedByUserId,
			deletedByUserId: params.deletedByUserId
		});
	}

	public get id(): number | null {
		return this._id;
	}

	public get title(): string {
		return this._title;
	}

	public get description(): string {
		return this._description;
	}

	public get price(): number {
		return this._price;
	}

	public get originalPrice(): number | null {
		return this._originalPrice;
	}

	public get images(): string[] {
		return this._images;
	}

	public get views(): number {
		return this._views;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}

	public get updatedAt(): Date | null {
		return this._updatedAt;
	}

	public get deletedAt(): Date | null {
		return this._deletedAt;
	}

	public get createdByUserId(): number {
		return this._createdByUserId;
	}

	public get updatedByUserId(): number | null {
		return this._updatedByUserId;
	}

	public get deletedByUserId(): number | null {
		return this._deletedByUserId;
	}

	public isDeleted(): boolean {
		return this._deletedAt !== null;
	}

	public changeTitle(newTitle: string, updatedByUserId: number) {
		this.validateString('title', newTitle);
		this._title = newTitle;
		this.markUpdated(updatedByUserId);
	}

	public changeDescription(newDescription: string, updatedByUserId: number) {
		this.validateString('description', newDescription);
		this._description = newDescription;
		this.markUpdated(updatedByUserId);
	}

	public changePrice(newPrice: number, updatedByUserId: number) {
		if (newPrice <= 0) throw new NonPositiveValueError('price', newPrice);
		this._price = newPrice;
		this.markUpdated(updatedByUserId);
	}

	public changeOriginalPrice(newOriginalPrice: number, updatedByUserId: number) {
		if (newOriginalPrice <= 0) throw new NonPositiveValueError('originalPrice', newOriginalPrice);
		this._originalPrice = newOriginalPrice;
		this.markUpdated(updatedByUserId);
	}

	public incrementViews() {
		this._views += 1;
	}

	public changeImages(newImages: string[], updatedByUserId: number) {
		newImages.forEach((url, index) => {
			this.validateUrl(`images[${index}]`, url);
		});
		this._images = newImages;
		this.markUpdated(updatedByUserId);
	}

	public markDeleted(deletedByUserId: number) {
		this._deletedByUserId = deletedByUserId;
		this._deletedAt = new Date();
	}

	private validateString(fieldName: string, str: string) {
		if (str.trim().length == 0) throw new EmptyStringError(fieldName);
	}

	private validateUrl(fieldName: string, url: string) {
		this.validateString(fieldName, url);
		try {
			const parsedUrl = new URL(url);
		} catch {
			throw new InvalidUrlError(fieldName, url);
		}
	}

	private markUpdated(updatedByUserId: number) {
		this._updatedByUserId = updatedByUserId;
		this._updatedAt = new Date();
	}
}
