import type { UserWithId } from './users.repository.types';

export type AddUserParams = {
	username: string;
	password: string;
};

export type UpdateUserParams = {
	targetId: number;
	username?: string;
	password?: string;
};

export type DeleteUserParams = {
	targetId: number;
};

export interface IUsersService {
	getUserById(id: number): Promise<UserWithId>;
	getUserByUsername(username: string): Promise<UserWithId>;
	addUser(params: AddUserParams): Promise<UserWithId>;
	updateUser(params: UpdateUserParams): Promise<UserWithId>;
	deleteUser(params: DeleteUserParams): Promise<void>;
}
