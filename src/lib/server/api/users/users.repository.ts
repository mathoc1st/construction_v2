import { User } from './user.domain';
import { UserSortableField, type IUserRepository, type UserFilterOptions } from './users.types';
import type { UserAggregateArgs } from '$lib/server/prisma/generated/models/User';
import { type IPrismaService, type SortOptions } from '$lib/server/prisma/prisma.types';
import type { Prisma } from '$lib/server/prisma/generated/client';

export class UserRepository implements IUserRepository {
	constructor(private readonly prismaService: IPrismaService) {}

	async getUserById(id: number): Promise<User | null> {
		const record = await this.prismaService.client.user.findUnique({
			where: { id }
		});

		if (!record) {
			return null;
		}

		return User.fromPersistence(record);
	}
	async getUserByUsername(username: string): Promise<User | null> {
		const record = await this.prismaService.client.user.findUnique({
			where: { username }
		});

		if (!record) {
			return null;
		}

		return User.fromPersistence(record);
	}

	async create(user: User): Promise<User> {
		const record = await this.prismaService.client.user.create({
			data: { username: user.username, passwordHash: user.passwordHash }
		});

		return User.fromPersistence(record);
	}

	async update(user: User): Promise<User> {
		const record = await this.prismaService.client.user.update({
			where: { id: user.id! },
			data: { username: user.username, passwordHash: user.passwordHash }
		});

		return User.fromPersistence(record);
	}

	async delete(user: User): Promise<void> {
		await this.prismaService.client.user.delete({
			where: { id: user.id! }
		});
	}

	private buildWhere(filters?: UserFilterOptions): UserAggregateArgs['where'] {
		const where: UserAggregateArgs['where'] = {};

		if (filters?.username) {
			where.username = { contains: filters.username };
		}

		return where;
	}

	private buildOrderBy(sort?: SortOptions<UserSortableField>): Prisma.UserOrderByWithRelationInput {
		if (!sort || !sort.field) {
			return {};
		}

		return {
			[sort.field]: sort.direction
		};
	}
}
