import type { Knex } from 'knex';
import {config as envConfig} from 'dotenv';

envConfig();

const {
	DATABASE_NAME,
	DATABASE_USER,
	DATABASE_PASSWORD,
} = process.env;

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'postgresql',
		connection: {
			filename: './db/migrations',
			database: DATABASE_NAME,
			user: DATABASE_USER,
			password: DATABASE_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './db/migrations'
		}
	},
  
	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},
  
	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
  
};

module.exports = config;
