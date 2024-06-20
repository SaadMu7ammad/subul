import * as configurationProvider from '@libs/configuration-provider/index';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, id: string, payloadType: string) => {
  const payload = makePayload(id, payloadType);

  const token: string = jwt.sign(payload, configurationProvider.getValue('hashing.jwtSecret'), {
    expiresIn: '3d',
  });

  setAuthenticationCookie(res, token);

  return token;
};

export const generateTokenForTesting = (id: string, payloadType: string) => {
  const payload = makePayload(id, payloadType);

  const token: string = jwt.sign(payload, configurationProvider.getValue('hashing.jwtSecret'), {
    expiresIn: '3d',
  });

  return token;
};

const setAuthenticationCookie = (res: Response, token: string) => {
  if (configurationProvider.getValue('environment.nodeEnv') === 'development') {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: configurationProvider.getValue('environment.nodeEnv'),
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
  } else if (configurationProvider.getValue('environment.nodeEnv') === 'production') {
    res.setHeader('Set-Cookie', [
      `jwt=${token};  Path=/;HttpOnly; maxAge=86400000;SameSite=None;Secure=true;`,
    ]);
  }
};

const makePayload = (id: string, payloadType: string) => {
  let payload: object | { charityId: string } | { userId: string } = {};
  if (payloadType === 'user') {
    payload = { userId: id };
  } else if (payloadType === 'charity') {
    payload = { charityId: id };
  }
  return payload;
};

export default generateToken;
