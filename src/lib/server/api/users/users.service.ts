import { getPrismaService } from '$lib/server/api/prisma/prisma.service';
import type { IUsersRepository, UserWithId } from '$lib/types/users/users.repository.types';
import type {
	AddUserParams,
	DeleteUserParams,
	IUsersService,
	UpdateUserParams
} from '$lib/types/users/users.service.types';
import type { IPasswordService } from '../auth/auth.type';
import { getPasswordService } from '../auth/password.service';
import { EntityNotFoundError } from '../common/errors/errors.service';
import { User } from './user.domain';
import { getUsersRepository } from './users.repository';

export class UsersService implements IUsersService {
	constructor(
		private readonly _usersRepository: IUsersRepository,
		private readonly _passwordService: IPasswordService
	) {}

	async getUserById(id: number): Promise<UserWithId> {
		const userWithId = await this._usersRepository.getById(id);

		if (!userWithId) throw new EntityNotFoundError('User', id);

		return userWithId;
	}

	async getUserByUsername(username: string): Promise<UserWithId> {
		const userWithId = await this._usersRepository.getByUsername(username);

		if (!userWithId) throw new EntityNotFoundError('User', 1);

		return userWithId;
	}

	async addUser(params: AddUserParams): Promise<UserWithId> {
		const passwordHash = await this._passwordService.hashPassword(params.password);

		const newUser = User.create({
			username: params.username,
			passwordHash
		});

		return await this._usersRepository.create(newUser);
	}

	async updateUser(params: UpdateUserParams): Promise<UserWithId> {
		const userWithId = await this._usersRepository.getById(params.targetId);

		if (!userWithId) throw new EntityNotFoundError('User', params.targetId);

		const user = userWithId.user;

		if (params.username) user.changeUsername(params.username);
		if (params.password) {
			const passwordHash = await this._passwordService.hashPassword(params.password);
			user.changePasswordHash(passwordHash);
		}

		return await this._usersRepository.update(params.targetId, user);
	}

	async deleteUser(params: DeleteUserParams): Promise<void> {
		const userWithId = await this._usersRepository.getById(params.targetId);

		if (!userWithId) throw new EntityNotFoundError('User', params.targetId);

		return this._usersRepository.delete(params.targetId);
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
