export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DomainError';
	}
}

export class NegativeValueError extends DomainError {
	constructor(fieldName: string, value: number) {
		super(`Invalid value for ${fieldName}: ${value}. Must be a non-negative number.`);
		this.name = 'NegativeValueError';
	}
}

export class NonPositiveValueError extends DomainError {
	constructor(fieldName: string, value: number) {
		super(`Invalid value for ${fieldName}: ${value}. Must be a positive number.`);
		this.name = 'NonPositiveValueError';
	}
}

export class EmptyStringError extends DomainError {
	constructor(fieldName: string) {
		super(`${fieldName} cannot be an empty string.`);
		this.name = 'EmptyStringError';
	}
}

export class InvalidUrlError extends DomainError {
	constructor(fieldName: string, url: string) {
		super(`Invalid URL for ${fieldName}: ${url}. Must be a valid URL.`);
		this.name = 'InvalidUrlError';
	}
}

export class InvalidPathError extends DomainError {
	constructor(fieldName: string, path: string) {
		super(`Invalid path for ${fieldName}: ${path}. Must be a valid path.`);
		this.name = 'InvalidPathError';
	}
}

export class InvalidImageExtensionError extends DomainError {
	constructor(fieldName: string, path: string) {
		super(
			`Invalid image extension for ${fieldName}: ${path}. Must be one of the following extensions: .jpg, .jpeg, .png, .webp, .gif.`
		);
		this.name = 'InvalidImageExtensionError';
	}
}

export class DeletedEntityModificationError extends DomainError {
	constructor(entity: string, id?: number) {
		super(
			`Cannot modify ${entity}${id !== undefined ? ` with id ${id}` : ''} because it is deleted.`
		);
		this.name = 'DeletedEntityModificationError';
	}
}

export class EntityAlreadyDeletedError extends DomainError {
	constructor(entity: string, id?: number) {
		super(`Entity ${entity}${id !== undefined ? ` with id ${id}` : ''} is already deleted.`);
		this.name = 'EntityAlreadyDeletedError';
	}
}

export class EntityMissingIdError extends DomainError {
	constructor(entity: string) {
		super(`Entity ${entity} is missing an id`);
		this.name = 'EntityMissingIdError';
	}
}
