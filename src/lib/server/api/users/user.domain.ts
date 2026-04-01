export class User {
	private _id: number | null;
	private _username: string;
	private _passwordHash: string;

	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(params: {
		id: number | null;
		username: string;
		passwordHash: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = params.id;
		this._username = params.username;
		this._passwordHash = params.passwordHash;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
	}

	static create(params: { username: string; passwordHash: string }): User {
		const now = new Date();

		return new User({
			id: null,
			username: params.username,
			passwordHash: params.passwordHash,
			createdAt: now,
			updatedAt: now
		});
	}

	static fromPersistence(params: {
		id: number;
		username: string;
		passwordHash: string;
		createdAt: Date;
		updatedAt: Date;
	}): User {
		return new User({
			id: params.id,
			username: params.username,
			passwordHash: params.passwordHash,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt
		});
	}

	get id() {
		return this._id;
	}

	get username() {
		return this._username;
	}

	get passwordHash() {
		return this._passwordHash;
	}
}
