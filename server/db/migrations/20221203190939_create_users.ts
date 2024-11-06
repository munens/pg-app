import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
		table.increments('id', {primaryKey: true});
		table.string('email', 255);
		table.string('password', 255);
		table.datetime('createdAt', {useTz: true}).defaultTo(knex.fn.now());
		table.datetime('deletedAt', {useTz: true})
			.nullable()
			.defaultTo(null);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users');
}

