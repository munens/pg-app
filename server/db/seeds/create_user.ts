import {Knex} from 'knex';
import {genSalt, hash} from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex('users').del();

	const saltRounds = 10;
	const salt = await genSalt(saltRounds);
	const hashedPassword = await hash('bog', salt);

	// Inserts seed entries
	await knex('users').insert([
		{email: 'm@m.com', password: hashedPassword},
	]);
}
