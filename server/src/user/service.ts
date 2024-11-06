import {compare, genSalt, hash} from 'bcrypt';
import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
import {BaseService} from '../model/base';
import {
	ConflictError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from '../model/error';
import {User, AuthParams} from '../model/user';
import {AuthUser} from '../model/user/auth-user';
import {UserRepository} from './repository';

config();

export class UserService extends BaseService {

	constructor(protected readonly repository: UserRepository) {
		super(repository);
	}

	findByEmail(email: string): Promise<User> {
		return this.repository.findByEmail(email);
	}

	async signUpUser({email, password}: AuthParams): Promise<AuthUser> {
		const user = await this.repository.findByEmail(email) as unknown as User;
		if (user) {
			throw new ConflictError();
		}

		let hashedPassword = null;

		try {
			const saltRounds = 10;
			const salt = await genSalt(saltRounds);
			hashedPassword = await hash(password, salt);
		} catch (err) {
			throw new InternalServerError(err);
		}

		await this.repository.insertUser({email, password: hashedPassword});

		return this.getAuthUser(email);
	}

	async authenticateUser({email, password}: AuthParams): Promise<AuthUser> {
		const user = await this.repository.findByEmailAndReturnPassword(email);
		if (!user) {
			throw new NotFoundError();
		}

		const result = await compare(password, user.password);
		if (!result) {
			throw new UnauthorizedError();
		}

		return this.getAuthUser(email);
	}

	private getSignedJwtToken(payload: { email: string }): string {
		return jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '10h'
		});
	}

	private async getAuthUser(email: string): Promise<AuthUser> {
		const user = await this.findByEmail(email);
		const token = this.getSignedJwtToken({email});

		return {
			user,
			token
		};
	}

}
