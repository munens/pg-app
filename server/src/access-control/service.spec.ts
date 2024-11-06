
import { config } from 'dotenv';
import {Request, Response, response} from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError, ForbiddenError } from '../model/error';
import { AccessControlRepository } from './repository';
import { AccessControlService } from './service';
import {Knex} from 'knex';

config();

describe('accessControlService', () => {

	const mockKnexClient = (() => ({
		queryBuilder: jest.fn()
	})) as unknown as Knex;

	const nextFunction = jest.fn();

	const repository = new AccessControlRepository(mockKnexClient);
	const service = new AccessControlService(repository);

	function getValidJwtToken(): string {
		const token = jwt.sign({ username: 'munens' }, process.env.JWT_SECRET, {
			expiresIn: '10h'
		});

		return `Bearer ${token}`;
	}

	describe('userIsAuthenticated', () => {

		it('should throw BadRequestError if user authentication token is unavailable', () => {
			const request = {
				get: jest.fn().mockReturnValue(undefined)
			} as unknown as Request;

			try {
				service.userIsAuthenticated(request, response, nextFunction);
			} catch (err) {
				expect(err).toBeInstanceOf(BadRequestError);
			}
		});

		it('should throw ForbiddenError if user authentication token is invalid', () => {
			const request = {
				get: jest.fn().mockReturnValue('bog')
			} as unknown as Request;

			try {
				service.userIsAuthenticated(request, response, nextFunction);
			} catch (err) {
				expect(err).toBeInstanceOf(ForbiddenError);
			}
		});

		it('should call next function if user authentication token is valid', () => {

			const request = {
				get: jest.fn().mockReturnValue(getValidJwtToken())
			} as unknown as Request;

			service.userIsAuthenticated(request, response, nextFunction);

			expect(nextFunction).toBeCalledTimes(1);
		});
	});

	describe('getUser', () => {

		const currentJwtSecret = process.env.JWT_SECRET;

		beforeEach(() => {
			process.env.JWT_SECRET = 'bog';
		});

		afterEach(() => {
			process.env.JWT_SECRET = currentJwtSecret;
		});

		it('should throw BadRequestError if user authentication token is unavailable', async () => {
			const request = {
				get: jest.fn().mockReturnValue(undefined)
			} as unknown as Request;

			try {
				await service.getUser(request, response, nextFunction);
			} catch (err) {
				expect(err).toBeInstanceOf(BadRequestError);
			}
		});

		it('should throw ForbiddenError if user authentication token is invalid', async () => {
			const request = {
				get: jest.fn().mockReturnValue('bog')
			} as unknown as Request;

			try {
				await service.getUser(request, response, nextFunction);
			} catch (err) {
				expect(err).toBeInstanceOf(ForbiddenError);
			}
		});

		it('should throw ForbiddenError if user user cannot be found', async () => {
			const request = {
				get: jest.fn().mockReturnValue(getValidJwtToken())
			} as unknown as Request;

			repository.findByEmail = jest.fn().mockResolvedValue(null);

			try {
				await service.getUser(request, response, nextFunction);
			} catch (err) {
				expect(err).toBeInstanceOf(ForbiddenError);
			}

			expect(repository.findByEmail).toBeCalledTimes(1);
		});

		it('should call next function if user can be found', async () => {

			const request = {
				get: jest.fn().mockReturnValue(getValidJwtToken())
			} as unknown as Request;

			const response = {
				locals: {}
			} as unknown as Response;

			const user = { email: 'munens@m.com' };
			repository.findByEmail = jest.fn().mockResolvedValue(user);

			await service.getUser(request, response, nextFunction);

			expect(repository.findByEmail).toBeCalledTimes(1);
			expect(response.locals.user).toEqual(user);
			expect(nextFunction).toBeCalledTimes(1);
		});
	});

});
