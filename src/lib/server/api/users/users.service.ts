import { getPrismaService } from '$lib/server/api/prisma/prisma.service';
import type { IUsersRepository } from '$lib/types/users/users.repository.types';
import type {
	AddUserParams,
	DeleteUserParams,
	IUsersService,
	UpdateUserParams
} from '$lib/types/users/users.service.types';
import type { IPasswordService } from '../auth/auth.type';
import { getPasswordService } from '../auth/password.service';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { User, UserId } from './user.domain';
import { getUsersRepository } from './users.repository';

export class UsersService implements IUsersService {
	constructor(
		private readonly _usersRepository: IUsersRepository,
		private readonly _passwordService: IPasswordService
	) {}

	async getUserById(id: UserId): Promise<User> {
		const user = await this._usersRepository.getById(id);

		if (!user) throw new Error('User not found');

		return user;
	}

	async getUserByUsername(username: string): Promise<User> {
		const user = await this._usersRepository.getByUsername(username);

		if (!user) throw new EntityNotFoundError('User', 1);

		return user;
	}

	async addUser(params: AddUserParams): Promise<User> {
		const passwordHash = await this._passwordService.hashPassword(params.password);

		const newUser = User.create({
			username: params.username,
			passwordHash
		});

		return await this._usersRepository.create(newUser);
	}

	async updateUser(params: UpdateUserParams): Promise<User> {
		const user = await this._usersRepository.getById(params.id);

		if (!user) throw new Error('User not found');

		if (params.username) user.changeUsername(params.username);
		if (params.password) {
			const passwordHash = await this._passwordService.hashPassword(params.password);
			user.changePasswordHash(passwordHash);
		}

		return await this._usersRepository.update(params.id, user);
	}

	async deleteUser(params: DeleteUserParams): Promise<void> {
		const user = await this._usersRepository.getById(params.id);

		if (!user) throw new Error('User not found');

		return this._usersRepository.delete(params.id);
	}
}

let usersService: IUsersService | null = null;

export const getUsersService = () => {
	const prismaService = getPrismaService();

	if (!usersService) {
		usersService = new UsersService(getUsersRepository(prismaService.client), getPasswordService());
	}
	return usersService;
};
