import type { DbClient } from '$lib/types/prisma/prisma.service.types';
import type { IUsersRepository, UserWithId } from '$lib/types/users/users.repository.types';
import { User } from './user.domain';

export class UserRepository implements IUsersRepository {
	constructor(private readonly _client: DbClient) {}

	withClient(client: DbClient): IUsersRepository {
		return new UserRepository(client);
	}

	async getById(id: number): Promise<UserWithId | null> {
		const record = await this._client.user.findUnique({
			where: { id }
		});

		if (!record) {
			return null;
		}

		return {
			id: record.id,
			user: User.fromPersistence(record)
		};
	}
	async getByUsername(username: string): Promise<UserWithId | null> {
		const record = await this._client.user.findUnique({
			where: { username }
		});

		if (!record) {
			return null;
		}

		return {
			id: record.id,
			user: User.fromPersistence(record)
		};
	}

	async create(user: User): Promise<UserWithId> {
		const record = await this._client.user.create({
			data: { username: user.username, passwordHash: user.passwordHash }
		});

		return {
			id: record.id,
			user: User.fromPersistence(record)
		};
	}

	async update(id: number, user: User): Promise<UserWithId> {
		const record = await this._client.user.update({
			where: { id },
			data: { username: user.username, passwordHash: user.passwordHash }
		});

		return {
			id: record.id,
			user: User.fromPersistence(record)
		};
	}

	async delete(id: number): Promise<void> {
		await this._client.user.delete({
			where: { id }
		});
	}

	// private buildWhere(filters?: UserFilterOptions): UserAggregateArgs['where'] {
	// 	const where: UserAggregateArgs['where'] = {};

	// 	if (filters?.username) {
	// 		where.username = { contains: filters.username };
	// 	}

	// 	return where;
	// }

	// private buildOrderBy(sort?: SortOptions<UserSortableField>): Prisma.UserOrderByWithRelationInput {
	// 	if (!sort || !sort.field) {
	// 		return {};
	// 	}

	// 	return {
	// 		[sort.field]: sort.direction
	// 	};
	// }
}

let usersRepository: IUsersRepository | null = null;

export const getUsersRepository = (client: DbClient) => {
	if (!usersRepository) {
		usersRepository = new UserRepository(client);
	}
	return usersRepository;
};
