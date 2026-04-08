import type { User, UserId } from '$lib/server/api/users/user.domain';

export type AddUserParams = {
	username: string;
	password: string;
};

export type UpdateUserParams = {
	id: UserId;
	username?: string;
	password?: string;
};

export type DeleteUserParams = {
	id: UserId;
};

export interface IUsersService {
	getUserById(id: UserId): Promise<User>;
	getUserByUsername(username: string): Promise<User>;
	addUser(params: AddUserParams): Promise<User>;
	updateUser(params: UpdateUserParams): Promise<User>;
	deleteUser(params: DeleteUserParams): Promise<void>;
}
