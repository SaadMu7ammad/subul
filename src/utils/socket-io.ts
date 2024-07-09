import * as configurationProvider from '@libs/configuration-provider';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export const authSocketMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '');
  const token = cookies['jwt']; // Replace with your actual cookie name
  console.log('token', cookies, token);

  if (token) {
    console.log('alooooo');
    const payload = verifyToken(token);
    if (payload) {
      if (payload.userId) (socket as any).userId = payload.userId; // Attach userId to socket object
      if (payload.charityId) (socket as any).charityId = payload.charityId; // Attach charityId to socket object
      return next();
    }
  }
  return next();
};

interface JwtPayload {
  userId: string;
  charityId: string;
}

export const verifyToken = (token: string): JwtPayload | null => {
  const JWT_SECRET = configurationProvider.getValue('hashing.jwtSecret');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
