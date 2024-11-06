import jwt from 'jsonwebtoken';

export interface JwtPayload extends jwt.JwtPayload {
  username: string;
}
