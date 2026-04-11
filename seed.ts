import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/src/generated/prisma/client';
import { hash } from '@node-rs/argon2';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const adminUsername = 'admin';
	const adminPassword = `!G5QOpA11&yrRF2'XT^N5!?T7`;

	const existing = await prisma.user.findUnique({
		where: { username: adminUsername }
	});

	const passwordHash = await hash(adminPassword, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	if (existing) {
		await prisma.user.update({
			where: { username: adminUsername },
			data: { passwordHash }
		});
		console.log('Admin user updated');
		return;
	}

	await prisma.user.create({
		data: {
			username: adminUsername,
			passwordHash: passwordHash
		}
	});

	console.log('Admin user created');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
