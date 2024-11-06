import {Router} from 'express';
import {UserService} from './service';
import {AccessControlService} from '../access-control/service';
import {BaseController} from '../model/base';
import {BadRequestError} from '../model/error';

export class UserController extends BaseController {
	readonly baseRoute = 'users';
	readonly router: Router = Router({mergeParams: true});

	constructor(
		protected readonly service: UserService,
		protected readonly accessControlService: AccessControlService
	) {
		super();

		this.initRoutes();
	}

	protected initRoutes(): void {

		this.router.get('/:email', this.accessControlService.userIsAuthenticated, async (req, res, next) => {
			try {
				const user = await this.service.findByEmail(req.params.email);
				res.status(200).send(user);
			} catch (err) {
				next(err);
			}
		});

		this.router.post('/sign-up', async ({body: {email, password}}, res, next) => {
			try {

				if (!email || !password) {
					throw new BadRequestError();
				}

				const authUser = await this.service.signUpUser({
					email,
					password,
				});
				res.status(201).send(authUser);
			} catch (err) {
				next(err);
			}

		});

		this.router.post('/login', async ({body: {email, password}}, res, next) => {

			try {

				if (!email || !password) {
					throw new BadRequestError();
				}

				const authUser = await this.service.authenticateUser({
					email,
					password
				});
				res.status(200).send(authUser);
			} catch (err) {
				next(err);
			}
		});
	}
}
