export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthorizationError';
	}
}

export interface IPasswordService {
	hashPassword(password: string): Promise<string>;
	comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
