import {Knex} from 'knex';
import {BaseRepository} from '../model/base';
import {AuthParams, User} from '../model/user';

export class UserRepository extends BaseRepository {

	constructor(knexClient: Knex) {
		super(knexClient, 'users');
	}

	async findByEmail(email: string): Promise<User> {
		const [data] = await this.queryBuilder
			.where('email', email)
			.andWhere('deletedAt', null)
			.returning(['id', 'email', 'createdAt']);
		return data;
	}

	async findByEmailAndReturnPassword(email: string): Promise<User & { password: string }> {
		const [data] = await this.queryBuilder
			.where('email', email)
			.andWhere('deletedAt', null)
			.returning('*');
		return data;
	}

	async insertUser({email, password}: AuthParams): Promise<void> {
		return this.queryBuilder.insert([{
			email,
			password,
			createdAt: new Date()
		}]);
	}
}
