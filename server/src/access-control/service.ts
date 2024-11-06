import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {BaseService} from '../model/base';
import {BadRequestError, ForbiddenError} from '../model/error';
import {JwtPayload} from '../model/jwt/jwt-payload';
import {User} from '../model/user';
import {AccessControlRepository} from './repository';

export class AccessControlService extends BaseService {

	constructor(protected readonly repository: AccessControlRepository) {
		super();
	}

	userIsAuthenticated = (req: Request, _: Response, next: NextFunction): void => {

		const authorizationToken = this.getAuthorizationToken(req);

		try {
			jwt.verify(authorizationToken, process.env.JWT_SECRET);
		} catch (err) {
			throw new ForbiddenError();
		}

		next();
	};

	getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

		const authorizationToken = this.getAuthorizationToken(req);

		const payload = jwt.decode(authorizationToken) as JwtPayload;

		const user = await this.repository.findByEmail(payload.username);

		if (!user) {
			throw new ForbiddenError();
		}

		res.locals.user = user;

		next();
	};

	private getAuthorizationToken = (req: Request): string => {
		const bearerToken = req.get('Authorization');
		if (!bearerToken) {
			throw new BadRequestError();
		}

		const token = bearerToken.split(' ')[1];

		if (!token) {
			throw new ForbiddenError();
		}

		return bearerToken.split(' ')[1];
	};
}
