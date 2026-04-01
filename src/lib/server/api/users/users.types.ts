import type { User } from './user.domain';

export type UserFilterOptions = {
	username?: string;
};

export enum UserSortableField {
	USERNAME = 'username',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt'
}

export interface IUserRepository {
	getUserById(id: number): Promise<User | null>;
	getUserByUsername(username: string): Promise<User | null>;
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<void>;
}
