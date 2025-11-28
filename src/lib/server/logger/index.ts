import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Log directory
const LOG_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}

export const logger = winston.createLogger({
	level: 'info',

	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),

	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ level, message, timestamp, stack }) => {
					return stack
						? `[${timestamp}] ${level}: ${message}\n${stack}`
						: `[${timestamp}] ${level}: ${message}`;
				})
			)
		}),

		new winston.transports.File({
			filename: path.join(LOG_DIR, 'app.log'),
			level: 'info'
		}),

		new winston.transports.File({
			filename: path.join(LOG_DIR, 'errors.log'),
			level: 'error'
		})
	]
});
