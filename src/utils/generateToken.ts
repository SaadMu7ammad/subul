import { Response } from 'express';
import jwt from 'jsonwebtoken';
import * as configurationProvider from '../libraries/configuration-provider/index';

const generateToken = (res: Response, id: string, payloadType: string) => {
  let payload: object | { charityId: string } | { userId: string } = {};
  if (payloadType === 'user') {
    payload = { userId: id };
  } else if (payloadType === 'charity') {
    payload = { charityId: id };
  }
  const token: string = jwt.sign(
    payload,
    configurationProvider.getValue('hashing.jwtSecret'),
    {
      expiresIn: '3d',
    }
  );
  if (configurationProvider.getValue('environment.nodeEnv') === 'development') {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: configurationProvider.getValue('environment.nodeEnv'),
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
  }else if (configurationProvider.getValue('environment.nodeEnv') === 'production'){
    res.setHeader('Set-Cookie',[`token=${token};  Path=/;HttpOnly; maxAge=86400000;SameSite=None;Secure=true;`]);
  }

  return token;
};

export default generateToken;
