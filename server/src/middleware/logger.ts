import winston from 'winston';
import expressWinston from 'express-winston';

export function logger() {
	return expressWinston.logger({
		transports: [
			new winston.transports.Console()
		],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json()
		),
		msg: 'HTTP {{req.method}} {{req.url}}',
		colorize: true
	});
}
