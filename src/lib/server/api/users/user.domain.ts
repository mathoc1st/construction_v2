import { EmptyStringError } from '../common/errors/errors.domain';
import { v7 as uuidv7 } from 'uuid';

export class UserId {
	constructor(public readonly value: string) {}

	static create(): UserId {
		return new UserId(uuidv7());
	}
}

export class User {
	private readonly _id: UserId;
	private _username: string;
	private _passwordHash: string;

	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(params: {
		id: UserId;
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
		if (params.username.trim() === '') {
			throw new EmptyStringError('username');
		}

		if (params.passwordHash.trim() === '') {
			throw new EmptyStringError('passwordHash');
		}

		const now = new Date();

		return new User({
			id: UserId.create(),
			username: params.username,
			passwordHash: params.passwordHash,
			createdAt: now,
			updatedAt: now
		});
	}

	static fromPersistence(params: {
		id: UserId;
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
