export class ServiceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ServiceError';
	}
}

export class EntityNotFoundError extends ServiceError {
	constructor(entity: string, id: number) {
		super(`Entity ${entity} with id ${id} was not found.`);
		this.name = 'EntityNotFoundError';
	}
}

export class AuthorizationError extends ServiceError {
	constructor() {
		super(`You are not authorized to perform this action`);
		this.name = 'EntityNotFoundError';
	}
}
