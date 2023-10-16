import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';

const addCase = asyncHandler(async (req, res, next) => {

res.json('all is good')
});
export {addCase};
