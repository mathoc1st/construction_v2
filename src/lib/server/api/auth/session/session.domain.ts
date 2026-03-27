export class Session {
	private _id: number | null;
	private _tokenHash: string | null;
	private _userId: number;
	private _expiresAt: Date;

	private _createdAt: Date;
	private _updatedAt: Date | null;

	private constructor(params: {
		id: number | null;
		tokenHash: string | null;
		userId: number;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date | null;
	}) {
		this._id = params.id;
		this._tokenHash = params.tokenHash;
		this._userId = params.userId;
		this._expiresAt = params.expiresAt;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
	}

	static create(params: { tokenHash: string; userId: number; expiresAt: Date }): Session {
		const now = new Date();
		return new Session({
			id: null,
			tokenHash: params.tokenHash,
			userId: params.userId,
			expiresAt: params.expiresAt,
			createdAt: now,
			updatedAt: null
		});
	}

	static fromPersistence(params: {
		id: number;
		tokenHash: string;
		userId: number;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date | null;
	}): Session {
		return new Session({
			id: params.id,
			tokenHash: params.tokenHash,
			userId: params.userId,
			expiresAt: params.expiresAt,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt
		});
	}

	get id(): number | null {
		return this._id;
	}

	get tokenHash(): string | null {
		return this._tokenHash;
	}

	get userId(): number {
		return this._userId;
	}

	get expiresAt(): Date {
		return this._expiresAt;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date | null {
		return this._updatedAt;
	}

	hasExpired(): boolean {
		const now = new Date();
		return this._expiresAt <= now;
	}
}
