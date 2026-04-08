import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/lib/server/api/prisma/generated/client';
import { getPasswordService } from '../src/lib/server/api/auth/password.service';
import { v7 as uuidv7 } from 'uuid';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const adminUsername = 'admin';
	const adminPassword = 'admin123';

	const existing = await prisma.user.findUnique({
		where: { username: adminUsername }
	});

	if (existing) {
		console.log('Admin already exists');
		return;
	}

	await prisma.user.create({
		data: {
			id: uuidv7(),
			username: adminUsername,
			passwordHash: await getPasswordService().hashPassword(adminPassword)
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
