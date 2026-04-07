import { hash, verify } from '@node-rs/argon2';
import type { IPasswordService } from './auth.type';

export class PasswordService implements IPasswordService {
	async hashPassword(password: string): Promise<string> {
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		return passwordHash;
	}

	async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		try {
			const isValid = await verify(hashedPassword, password);
			return isValid;
		} catch (error) {
			console.error('Error comparing password:', error);
			return false;
		}
	}
}

let passwordServiceInstance: PasswordService | null = null;

export function getPasswordService(): PasswordService {
	if (!passwordServiceInstance) {
		passwordServiceInstance = new PasswordService();
	}
	return passwordServiceInstance;
}
