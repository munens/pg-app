import {Knex} from 'knex';

export abstract class BaseRepository {

	protected readonly queryBuilder: Knex.QueryBuilder;

	constructor(
		protected readonly knexClient: Knex,
		protected readonly tableName: string
	) {
		this.queryBuilder = knexClient(tableName);
	}
}
