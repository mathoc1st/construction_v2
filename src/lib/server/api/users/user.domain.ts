import { EmptyStringError } from '../common/errors/errors.domain';

export class User {
	private _username: string;
	private _passwordHash: string;

	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(params: {
		username: string;
		passwordHash: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._username = params.username;
		this._passwordHash = params.passwordHash;
		this._createdAt = params.createdAt;
		this._updatedAt = params.updatedAt;
	}

	static create(params: { username: string; passwordHash: string }): User {
		if (params.username.trim() === '') {
			throw new EmptyStringError('username');
		}

		if (params.passwordHash.trim() === '') {
			throw new EmptyStringError('passwordHash');
		}

		const now = new Date();

		return new User({
			username: params.username,
			passwordHash: params.passwordHash,
			createdAt: now,
			updatedAt: now
		});
	}

	static fromPersistence(params: {
		username: string;
		passwordHash: string;
		createdAt: Date;
		updatedAt: Date;
	}): User {
		return new User({
			username: params.username,
			passwordHash: params.passwordHash,
			createdAt: params.createdAt,
			updatedAt: params.updatedAt
		});
	}

	get username() {
		return this._username;
	}

	get passwordHash() {
		return this._passwordHash;
	}

	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	changeUsername(newUsername: string) {
		if (newUsername.trim() === '') {
			throw new EmptyStringError('username');
		}

		this._username = newUsername;
		this._updatedAt = new Date();
	}

	changePasswordHash(newPasswordHash: string) {
		if (newPasswordHash.trim() === '') {
			throw new EmptyStringError('passwordHash');
		}

		this._passwordHash = newPasswordHash;
		this._updatedAt = new Date();
	}
}
