import type { DbClient } from '$lib/types/prisma/prisma.service.types';
import type { IUsersRepository } from '$lib/types/users/users.repository.types';
import { User, UserId } from './user.domain';

export class UserRepository implements IUsersRepository {
	constructor(private readonly _client: DbClient) {}

	async getById(id: UserId): Promise<User | null> {
		const record = await this._client.user.findUnique({
			where: { id: id.value }
		});

		if (!record) {
			return null;
		}

		return User.fromPersistence({
			...record,
			id: new UserId(record.id)
		});
	}
	async getByUsername(username: string): Promise<User | null> {
		const record = await this._client.user.findUnique({
			where: { username }
		});

		if (!record) {
			return null;
		}

		return User.fromPersistence({
			...record,
			id: new UserId(record.id)
		});
	}

	async create(user: User): Promise<User> {
		const record = await this._client.user.create({
			data: { id: user.id.value, username: user.username, passwordHash: user.passwordHash }
		});

		return User.fromPersistence({
			...record,
			id: new UserId(record.id)
		});
	}

	async update(id: UserId, user: User): Promise<User> {
		const record = await this._client.user.update({
			where: { id: id.value },
			data: { username: user.username, passwordHash: user.passwordHash }
		});

		return User.fromPersistence({
			...record,
			id: new UserId(record.id)
		});
	}

	async delete(id: UserId): Promise<void> {
		await this._client.user.delete({
			where: { id: id.value }
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
