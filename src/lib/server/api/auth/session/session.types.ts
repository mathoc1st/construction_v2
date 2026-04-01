import type { Session } from './session.domain';

export interface ISessionRepository {
	create(session: Session): Promise<Session>;
	delete(session: Session): Promise<void>;
	update(session: Session): Promise<Session>;
	getSessionByTokenHash(tokenHash: string): Promise<Session | null>;
}

export type CreateSessionParams = {
	userId: number;
};

export type ValidateSessionParams = {
	token: string;
};

export type InvalidateSessionParams = {
	token: string;
};

export type CreationSessionResult = {
	session: Session;
	token: string;
};

export type ValidateSessionResult =
	| { status: 'valid'; session: Session }
	| { status: 'expired'; session: Session }
	| { status: 'invalid' };

export interface ISessionService {
	createSession(params: CreateSessionParams): Promise<CreationSessionResult>;
	validateSession(params: ValidateSessionParams): Promise<ValidateSessionResult>;
	invalidateSession(params: InvalidateSessionParams): Promise<void>;
}
