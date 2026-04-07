import type { User } from '$lib/server/api/users/user.domain';
import type { DbClient } from '../prisma/prisma.service.types';

export type UserWithId = {
	id: number;
	user: User;
};

export type UserFilterOptions = {
	username?: string;
};
export interface IUsersRepository {
	withClient(client: DbClient): IUsersRepository;
	getById(id: number): Promise<UserWithId | null>;
	getByUsername(username: string): Promise<UserWithId | null>;
	create(user: User): Promise<UserWithId>;
	update(id: number, user: User): Promise<UserWithId>;
	delete(id: number): Promise<void>;
}
