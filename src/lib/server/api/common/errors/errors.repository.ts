export class RepostiryError extends Error {
	constructor(message: string) {
		super(message); // Call the parent constructor

		this.name = this.constructor.name; // Set the error name correctly

		// Fix the prototype chain (important for instanceof checks)
		Object.setPrototypeOf(this, new.target.prototype);

		// Optional: capture stack trace (V8 engines like Node.js)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export class NotFoundError extends RepostiryError {
	constructor(message = 'Entity not found', entityName?: string, entityId?: string | number) {
		if (entityName && entityId) {
			message = `${entityName} with ID ${entityId} not found`;
		} else if (entityName) {
			message = `${entityName} not found`;
		}
		super(message);
	}
}

export class ValidationError extends RepostiryError {
	constructor(message = 'Invalid data') {
		super(message);
	}
}

export class UnknownRepositoryError extends RepostiryError {
	constructor(message = 'Database error') {
		super(message);
	}
}
