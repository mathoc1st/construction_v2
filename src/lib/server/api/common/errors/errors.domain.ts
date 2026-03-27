export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DomainError';
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
