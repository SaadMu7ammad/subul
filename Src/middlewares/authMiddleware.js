import jwt from 'jsonwebtoken';

import asyncHandler from 'express-async-handler';

import { User } from '../models/userModel.js';
import Charity  from '../models/charityModel.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import logger from '../utils/logger.js';

const auth = asyncHandler(async (req, res, next) => {
  const authCookie = req.cookies.jwt; //according to cookie parser

  if (!authCookie) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  try {
    const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);
    // attach the user to the job routes
    if(decoded.userId){
      req.user = await User.findById(decoded.userId).select('-password');
    }else if(decoded.charityId){

      req.charity = await Charity.findById(decoded.charityId).select('-password');
    }
    // console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
});



export { auth };
