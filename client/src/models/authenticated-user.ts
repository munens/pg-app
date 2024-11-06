import { IUser } from './user.ts';

export interface IAuthenticatedUser {
  user: IUser;
  token: string;
}
