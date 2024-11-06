import {UserController} from './controller';
import {UserService} from './service';
import {UserRepository} from './repository';
import {AccessControlModule} from '../access-control';
import {AccessControlService} from '../access-control/service';
import {BaseModule} from '../model/base';
import {Knex} from 'knex';

export class UserModule extends BaseModule {

	controller: UserController;
	private service: UserService;
	private accessControlService: AccessControlService;
	private userRepository: UserRepository;

	init(knexClient: Knex): void {

		const accessControlModule = new AccessControlModule();
		accessControlModule.init(knexClient);
		this.accessControlService = accessControlModule.service;

		this.userRepository = new UserRepository(knexClient);
		this.service = new UserService(this.userRepository);
		this.controller = new UserController(this.service, this.accessControlService);
	}
}
