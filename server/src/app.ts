// packages:
import express from 'express';
import knex, {Knex} from 'knex';

//middleware:
import {corsHandler} from './middleware/cors';
import {logger} from './middleware/logger';
import {errorHandler} from './middleware/error-handler';

// base classes:
import {BaseModule} from './model/base';

// database config:
import {DatabaseConfig} from './database-config';

export class Application {

	private knexClient: Knex;
	private app: express.Application = express();

	constructor(
    private readonly PORT: string,
    private readonly modules: ReadonlyArray<BaseModule>,
    private readonly databaseConfig: DatabaseConfig
	) {}

	init(): void {
		
		console.log('initialize');

		const {
			host,
			user,
			password,
			port,
			name: database
		} = this.databaseConfig;

		this.knexClient = knex({
			client: 'pg',
			connection: {
				host,
				port,
				user,
				password,
				database
			},
			pool: {
				min: 0,
				max: 7
			}
		});

		this.initAppLevelMiddleware();
		this.initModules();
		this.initRoutes();
		this.initErrorHandlingMiddleware();
		this.listen();
	}

	private initAppLevelMiddleware(): void {
		const middlewares = [
			corsHandler(),
			logger(),
			express.json()
		];

		middlewares
			.forEach((middleware) => this.app.use(middleware));
	}

	private initModules(): void {
		this.modules
			.forEach((module) => module.init(this.knexClient));
	}

	private initRoutes(): void {
		this.modules
			.map((module: BaseModule) => module.controller)
			.filter((controller) => controller)
			.forEach((controller) => this.app.use(`/${controller.baseRoute}`, controller.router));
	}

	private initErrorHandlingMiddleware(): void {
		const middlewares = [
			errorHandler
		];

		middlewares
			.forEach((middleware) => this.app.use(middleware));
	}

	private listen(): void {
		this.app.listen(
			this.PORT,
			// eslint-disable-next-line no-console
			() => console.log(`app listening at ${this.PORT || 8090}`)
		);
	}
}
