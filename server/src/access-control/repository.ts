import {BaseRepository} from '../model/base/repository';
import {Knex} from 'knex';
import {User} from '../model/user';

export class AccessControlRepository extends BaseRepository {

	constructor(readonly knex: Knex) {
		super(knex, 'users');
	}

	findByEmail(username: string,): Promise<User> {
		return this.queryBuilder
			.where('email', username)
			.andWhere('deletedAt', null)
			.returning(['id', 'email', 'createdAt'])
			.then();
	}
}
