import jwt from 'jsonwebtoken';

import User from '../../user/data-access/models/user.model';
import Charity from '../../charity/data-access/models/charity.model';
import { UnauthenticatedError } from '../../../libraries/errors/components/index';
import * as configurationProvider from '../../../libraries/configuration-provider/index';
import { Decoded } from './interface';
import { NextFunction, Request, Response } from 'express';
// import * as core from "express-serve-static-core";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const req = _req as AuthedRequest;

    if (req.headers && req.headers.cookie) {
      // throw new customError.UnauthenticatedError('no token found');
      const authHeader = req.headers.cookie;
      const jwtToken = authHeader.split('=')[1];
      if (!jwtToken) {
        throw new UnauthenticatedError('no token found');
      }
      // const authCookie = req.headers.jwt; //according to cookie parser
      const decoded = <Decoded>(
        jwt.verify(
          jwtToken,
          configurationProvider.getValue('hashing.jwtSecret')
        )
      );
      // attach the user to the job routes
      if (decoded.userId) {
        // check first the user or chariy exists in the db
        const IsUserExist = await User.findById(decoded.userId).select(
          '-password'
        );
        if (!IsUserExist)
          throw new UnauthenticatedError('Authentication invalid');
        res.locals.user = IsUserExist;
      } else if (decoded.charityId) {
        const IsCharityExist = await Charity.findById(decoded.charityId).select(
          '-password'
        );
        if (!IsCharityExist)
          throw new UnauthenticatedError('Authentication invalid');

        res.locals.charity = IsCharityExist;
      }
      next();
    } else {
      throw new UnauthenticatedError('No Header Sent');
    }
  } catch (err) {
    next(err);
  }
};
const isConfirmed = (req: Request, res: Response, next: NextFunction) => {
  //for the sending docs to the admin website for Charity Only
  if (res.locals.user) {
    throw new UnauthenticatedError('Users Are Not Allowed To Do This Action!');
  }
  if (
    res.locals.charity &&
    res.locals.charity.isConfirmed &&
    res.locals.charity.isEnabled
  ) {
    next();
  } else {
    throw new UnauthenticatedError(
      'Charity Account is not Confirmed , You must upload your docs first!'
    );
  }
};
const isActivated = (req: Request, res: Response, next: NextFunction) => {
  //for both charity and user
  if (
    (res.locals.charity &&
      (res.locals.charity.emailVerification.isVerified ||
        res.locals.charity.phoneVerification.isVerified)
      && res.locals.charity.isEnabled) ||
    (res.locals.user &&
      (res.locals.user.emailVerification.isVerified ||
        res.locals.user.phoneVerification.isVerified)
      && res.locals.user.isEnabled)
  ) {
    next();
  } else {
    if (res.locals.charity) {
      throw new UnauthenticatedError(
        'Charity Account is not Activated , You must activate your account via email or phone number first!'
      );
    } else if (res.locals.user) {
      throw new UnauthenticatedError(
        'User Account is not Activated , You must activate your account via email or phone number first!'
      );
    }
  }
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user) {
    next();
  } else {
    throw new UnauthenticatedError('Only Users Are Allowed To Do This Action!');
  }
}

export { auth, isConfirmed, isActivated,isUser}