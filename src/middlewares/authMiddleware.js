import jwt from 'jsonwebtoken';

import asyncHandler from 'express-async-handler';

import User from '../components/user/data-access/models/user.model.js';
import Charity from '../models/charityModel.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import logger from '../utils/logger.js';

const auth = asyncHandler(async (req, res, next) => {
    const authCookie = req.cookies.jwt; //according to cookie parser
    if (!authCookie) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);
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
});

export { auth };
