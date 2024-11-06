import {NextFunction, Request, Response} from 'express';
import {HttpError, InternalServerError} from '../model/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _1: Request, res: Response, _2: NextFunction): Response<any, Record<string, any>> {

	// eslint-disable-next-line no-console
	console.log(err);

	if (err instanceof HttpError) {
		return res.status(err.statusCode).send(err);
	}

	const unknownError = new InternalServerError(null, err, err.stack ?? err.toString());

	return res.status(unknownError.statusCode).send(unknownError);
}
