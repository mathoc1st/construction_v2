import type { User, UserId } from '$lib/server/api/users/user.domain';

export type UserWithId = {
	id: number;
	user: User;
};

export type UserFilterOptions = {
	username?: string;
};
export interface IUsersRepository {
	getById(id: UserId): Promise<User | null>;
	getByUsername(username: string): Promise<User | null>;
	create(user: User): Promise<User>;
	update(id: UserId, user: User): Promise<User>;
	delete(id: UserId): Promise<void>;
}
