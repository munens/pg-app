import {ErrorCause} from './error-cause';
import {HttpStatusCode} from './http-status-code';
import {HttpStatusMessage} from './http-status-message';

interface ErrorParams {
	readonly statusCode: HttpStatusCode;
	readonly statusMessage: HttpStatusMessage,
	readonly message?: string;
	readonly cause?: ErrorCause;
	readonly stack?: string;
}

export class HttpError extends Error {

	readonly statusCode: HttpStatusCode;
	readonly statusMessage: HttpStatusMessage;
	readonly message: string;
	readonly cause?: ErrorCause;

	constructor({
		statusCode,
		statusMessage,
		message,
		cause,
		stack
	}: ErrorParams) {

		super(message ?? statusMessage);

		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.stack = stack;
		this.message = message;
		this.cause = cause;
	}
}
