import Charity from '../models/Charity.js';
import asyncHandler from 'express-async-handler';
import {
    BadRequestError,
    CustomAPIError,
    NotFoundError,
    UnauthenticatedError,
  } from '../errors/index.js';
const registerCharity = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    let charity = Charity.findOne({ email });
    if (charity) {
        throw new BadRequestError('An Account with this Email already exists');
    }
    charity = await Charity.create(req.body);
    if(!charity) throw new Error('Something went wrong');
    generateToken(res, user._id);
    await setupMailSender(
        req,
        'welcome alert',
        'Hi ' +
            charity.name.firstName +
            ' We are happy that you joined our community💚 ... keep spreading goodness with us'
    );
    res.status(201).json({
        _id: charity._id,
        name:charity.name,
        email,
    });
});
export { registerCharity };
