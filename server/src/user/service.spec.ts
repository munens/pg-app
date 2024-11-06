import bcrypt from 'bcrypt';
import {ConflictError, InternalServerError, NotFoundError} from '../model/error';
import {UserRepository} from './repository';
import {UserService} from './service';
import {UnauthorizedError} from '../model/error';
import {Knex} from 'knex';

describe('UserService', () => {

	const mockKnexClient = (() => ({
		queryBuilder: jest.fn()
	})) as unknown as Knex;

	const user = {email: 'munens@m.com'};
	const repository = new UserRepository(mockKnexClient);
	const service = new UserService(repository);

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('signUpUser', () => {

		const auth = {...user, password: 'hello'};

		it('should throw a conflictError if user can be found', async () => {

			repository.findByEmail = jest.fn().mockResolvedValue(user);

			try {
				await service.signUpUser(auth);
			} catch (err) {
				expect(err).toBeInstanceOf(ConflictError);
			}

			expect(repository.findByEmail).toBeCalledTimes(1);
		});

		it('should throw a InternalServerError if genSalt function throws', async () => {

			repository.findByEmail = jest.fn().mockResolvedValue(null);

			const spy = jest.spyOn(bcrypt, 'genSalt');
			spy.mockImplementation(async () => {
				throw new Error('error');
			});

			try {
				await service.signUpUser(auth);
			} catch (err) {
				expect(err).toBeInstanceOf(InternalServerError);
			}
			expect(spy).toHaveBeenCalledTimes(1);
			expect(repository.findByEmail).toBeCalledTimes(1);
		});

		it('should throw a InternalServerError if hash function throws', async () => {

			repository.findByEmail = jest.fn().mockResolvedValue(null);

			const spy = jest.spyOn(bcrypt, 'hash');
			spy.mockImplementation(async () => {
				throw new Error('error');
			});

			try {
				await service.signUpUser(auth);
			} catch (err) {
				expect(err).toBeInstanceOf(InternalServerError);
			}

			expect(spy).toHaveBeenCalledTimes(1);
			expect(repository.findByEmail).toBeCalledTimes(1);
		});

		it('should insert a user if salting and hashing is successful', async () => {

			repository.findByEmail = jest.fn()
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(user);
			repository.insertUser = jest.fn().mockResolvedValue({});

			service.findByEmail = jest.fn().mockResolvedValue(user);

			const saltSpy = jest.spyOn(bcrypt, 'genSalt');
			saltSpy.mockImplementation(async () => 'salt');

			const hashSpy = jest.spyOn(bcrypt, 'hash');
			hashSpy.mockImplementation(async () => 'hash');

			const result = await service.signUpUser(auth);

			expect(saltSpy).toHaveBeenCalledTimes(1);
			expect(hashSpy).toHaveBeenCalledTimes(1);

			expect(service.findByEmail).toBeCalledTimes(1);
			expect(repository.findByEmail).toBeCalledTimes(1);
			expect(repository.insertUser).toBeCalledTimes(1);
			expect(Object.keys(result)).toEqual(['user', 'token']);
		});

	});

	describe('authenticateUser', () => {

		const auth = {...user, password: 'hello'};

		it('should throw if a user cannot be found', async () => {

			repository.findByEmailAndReturnPassword = jest.fn().mockResolvedValue(null);

			try {
				await service.authenticateUser(auth);
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}

			expect(repository.findByEmailAndReturnPassword).toBeCalledTimes(1);
		});

		it('should throw an UnaithorizedError if password comparison fails', async () => {

			repository.findByEmailAndReturnPassword = jest.fn().mockResolvedValue(auth);
			repository.findByEmail = jest.fn().mockResolvedValue(user);

			const spy = jest.spyOn(bcrypt, 'compare');
			spy.mockImplementation(async () => false);

			try {
				await service.authenticateUser(auth);
			} catch (err) {
				expect(err).toBeInstanceOf(UnauthorizedError);
			}
			expect(spy).toHaveBeenCalledTimes(1);
			expect(repository.findByEmailAndReturnPassword).toBeCalledTimes(1);
			expect(repository.findByEmail).toBeCalledTimes(0);
		});

		it('should insert a user if password comparison is successful', async () => {

			repository.findByEmailAndReturnPassword = jest.fn().mockResolvedValue(auth);
			repository.findByEmail = jest.fn().mockResolvedValue(user);

			const spy = jest.spyOn(bcrypt, 'compare');
			spy.mockImplementation(async () => true);

			const result = await service.authenticateUser(auth);

			expect(repository.findByEmailAndReturnPassword).toBeCalledTimes(1);
			expect(service.findByEmail).toBeCalledTimes(1);
			expect(Object.keys(result)).toEqual(['user', 'token']);
		});
	});
});
