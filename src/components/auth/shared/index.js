import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../../user/data-access/models/user.model.js';
import Charity from '../../charity/data-access/models/charity.model.js';
import { UnauthenticatedError } from '../../../libraries/errors/components/index.js';
import logger from '../../../utils/logger.js';
import * as configurationProvider from '../../../libraries/configuration-provider/index.js'

const auth = async (req, res, next) => {
  try {
    const authCookie = req.cookies.jwt; //according to cookie parser
    if (!authCookie) {
      throw new UnauthenticatedError('Authentication invalid');
    }
    const decoded = jwt.verify(authCookie, configurationProvider.getValue('hashing.jwtSecret'));
    // attach the user to the job routes
    if (decoded.userId) {
      // check first the user or chariy exists in the db
      const IsUserExist = await User.findById(decoded.userId).select(
        '-password'
      );
      if (!IsUserExist)
        throw new UnauthenticatedError('Authentication invalid');
      req.user = IsUserExist;
    } else if (decoded.charityId) {
      const IsCharityExist = await Charity.findById(decoded.charityId).select(
        '-password'
      );
      if (!IsCharityExist)
        throw new UnauthenticatedError('Authentication invalid');

      req.charity = IsCharityExist;
    }
    // console.log(req.user);
    next();
  } catch (err) {
    next(err);
  }
};
const isConfirmed = (req, res, next) => {
  //for the sending docs to the admin website for Chariy Only
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
const isActivated = (req, res, next) => {
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