import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../../user/data-access/models/user.model';
import Charity from '../../charity/data-access/models/charity.model';
import { UnauthenticatedError } from '../../../libraries/errors/components/index';
import * as configurationProvider from '../../../libraries/configuration-provider/index';
import { AuthedRequest } from '../user/data-access/auth.interface';
import { Decoded } from './interface';
import { IUserDocument } from '../../user/data-access/interfaces/user.interface';
import { ICharityDocument } from '../../charity/data-access/interfaces/charity.interface';
import { NextFunction, Request, Response } from 'express';

const auth = async (_req: Request, res:Response, next:NextFunction) => {
  try {
        const req = _req as AuthedRequest;

    if (req.headers && req.headers.cookie) {
      // throw new customError.UnauthenticatedError('no token found');
      const authHeader = req.headers.cookie;
      const jwtToken = authHeader.split('=')[1];
      if (!jwtToken) {
        throw new UnauthenticatedError('no token found');
      }
      // const authCookie = req.headers.jwt; //according to cookie parser
      const decoded = (<Decoded>(
        jwt.verify(
          jwtToken,
          configurationProvider.getValue('hashing.jwtSecret')
        )
      )) as JwtPayload;
      // attach the user to the job routes
      if (decoded.userId) {
        // check first the user or chariy exists in the db
        const IsUserExist = await User.findById(decoded.userId).select(
          '-password'
        ) as IUserDocument|null;
        if (!IsUserExist)
          throw new UnauthenticatedError('Authentication invalid');
        req.user = IsUserExist;
      } else if (decoded.charityId) {
        const IsCharityExist = await Charity.findById(decoded.charityId).select(
          '-password'
        ) as ICharityDocument|null;
        if (!IsCharityExist)
          throw new UnauthenticatedError('Authentication invalid');

        req.charity = IsCharityExist;
      }
      next();
    } else {
      throw new UnauthenticatedError('No Header Sent');
    }
  } catch (err) {
    next(err);
  }
};
const isConfirmed = (_req: Request, res: Response, next: NextFunction) => {
  const req = _req as AuthedRequest;

  //for the sending docs to the admin website for Charity Only
  if (req.user) {
    throw new UnauthenticatedError('Users Are Not Allowed To Do This Action!');
  }
  if (req.charity && req.charity.isConfirmed && req.charity.isEnabled) {
    next();
  } else {
    throw new UnauthenticatedError(
      'Charity Account is not Confirmed , You must upload your docs first!'
    );
  }
};
const isActivated = (_req: Request, res: Response, next: NextFunction) => {
  const req = _req as AuthedRequest;

  //for both charity and user
  if (
    (req.charity &&
      (req.charity.emailVerification.isVerified ||
        req.charity.phoneVerification.isVerified)) ||
    (req.user &&
      (req.user.emailVerification.isVerified ||
        req.user.phoneVerification.isVerified))
  ) {
    next();
  } else {
    if (req.charity) {
      throw new UnauthenticatedError(
        'Charity Account is not Activated , You must activate your account via email or phone number first!'
      );
    } else if (req.user) {
      throw new UnauthenticatedError(
        'User Account is not Activated , You must activate your account via email or phone number first!'
      );
    }
  }
};
export { auth, isConfirmed, isActivated };
