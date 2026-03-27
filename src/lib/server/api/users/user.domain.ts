export class User {
	private _id: number | null;
	private _username: string;
	private _passwordHash: string;

	private constructor(params: { id: number | null; username: string; passwordHash: string }) {
		this._id = params.id;
		this._username = params.username;
		this._passwordHash = params.passwordHash;
	}

	static create(params: { username: string; passwordHash: string }): User {
		return new User({
			id: null,
			username: params.username,
			passwordHash: params.passwordHash
		});
	}

	static fromPersistence(params: { id: number; username: string; passwordHash: string }): User {
		return new User({
			id: params.id,
			username: params.username,
			passwordHash: params.passwordHash
		});
	}

	get id() {
		return this._id;
	}

	get username() {
		return this._username;
	}
}
