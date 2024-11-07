import {AccessControlModule} from '../access-control';
import {AccessControlService} from '../access-control/service';
import {BaseModule} from '../model/base';
import {Knex} from 'knex';
import {ReservationsController} from './controller';
import {ReservationsService} from './service';
import {ReservationsRepository} from './repository';

export class ReservationsModule extends BaseModule {
	
	controller: ReservationsController;
	private service: ReservationsService;
	private accessControlService: AccessControlService;
	private reservationsRepository: ReservationsRepository;
	
	init(knexClient: Knex): void {
		
		const accessControlModule = new AccessControlModule();
		accessControlModule.init(knexClient);
		this.accessControlService = accessControlModule.service;
		
		this.reservationsRepository = new ReservationsRepository(knexClient);
		this.service = new ReservationsService(this.reservationsRepository);
		this.controller = new ReservationsController(this.service, this.accessControlService);
	}
}