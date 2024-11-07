import {Router} from 'express';
import {ReservationsService} from './service';
import {AccessControlService} from '../access-control/service';
import {BaseController} from '../model/base';

export class ReservationsController extends BaseController {
	readonly baseRoute = 'reservations';
	readonly router: Router = Router({mergeParams: true});
	
	constructor(
		protected readonly service: ReservationsService,
		protected readonly accessControlService: AccessControlService
	) {
		super();
		
		this.initRoutes();
	}
	
	protected initRoutes(): void {
		
		this.router.get('/', async (req, res, next) => {
			try {
				const reservations = this.service.getReservations();
				res.status(200).send(reservations);
			} catch (err) {
				next(err);
			}
		});
	}
}