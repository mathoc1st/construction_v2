import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Log directory
const LOG_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}

const prettyJson = winston.format.printf((info) => {
	// Try to parse message if it is JSON-like
	let msg = info.message;

	// Detect `{` or `[` — good enough heuristic
	if (typeof msg === 'string' && msg.trim().match(/^(\{|\[)/)) {
		try {
			msg = JSON.parse(msg);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			// leave the message as is
		}
	}

	// Build final object
	const output = {
		...info,
		message: msg
	};

	return JSON.stringify(output, null, 2);
});

export const logger = winston.createLogger({
	level: 'debug',

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
		}),

		new winston.transports.File({
			filename: path.join(LOG_DIR, 'debug.log'),
			level: 'debug',
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.errors({ stack: true }),
				prettyJson
			)
		})
	]
});
