import {config} from 'dotenv';

// modules:
import {UserModule} from './user';

config();

const {
	PORT,
	DATABASE_NAME,
	DATABASE_USER,
	DATABASE_PASSWORD,
	DATABASE_HOST,
	DATABASE_PORT,
} = process.env;

import {Application} from './app';
import {DatabaseConfig} from './database-config';

const modules = [
	new UserModule()
];

const databaseConfig: DatabaseConfig = {
	name: DATABASE_NAME,
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: Number(DATABASE_PORT),
};

const app = new Application(
	PORT,
	modules,
	databaseConfig
);

app.init();
