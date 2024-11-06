import {AccessControlService} from './service';
import {AccessControlRepository} from './repository';
import {BaseModule} from '../model/base';
import {Knex} from 'knex';

export class AccessControlModule extends BaseModule {

	repository: AccessControlRepository;
	service: AccessControlService;

	init(knexClient: Knex) {
		this.repository = new AccessControlRepository(knexClient);
		this.service = new AccessControlService(this.repository);
	}
}
