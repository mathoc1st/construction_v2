import type { UserId } from '../../users/user.domain';
import { v7 as uuidv7 } from 'uuid';

export class SessionId {
	constructor(public readonly value: string) {}

	static create(): SessionId {
		return new SessionId(uuidv7());
	}
}

export class Session {
	private readonly _id: SessionId;
	private _tokenHash: string | null;
	private _expiresAt: Date;

	private _userId: UserId;

	private _createdAt: Date;
	private _updatedAt: Date | null;

	private constructor(params: {
		id: SessionId;
		tokenHash: string | null;
		userId: UserId;
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

	static create(params: { tokenHash: string; userId: UserId; expiresAt: Date }): Session {
		const now = new Date();
		return new Session({
			id: SessionId.create(),
			tokenHash: params.tokenHash,
			userId: params.userId,
			expiresAt: params.expiresAt,
			createdAt: now,
			updatedAt: now
		});
	}

	static fromPersistence(params: {
		id: SessionId;
		tokenHash: string;
		userId: UserId;
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

	get id(): SessionId {
		return this._id;
	}

	get tokenHash(): string | null {
		return this._tokenHash;
	}

	get userId(): UserId {
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
