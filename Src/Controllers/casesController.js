import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import Cases from '../models/caseModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';

const addCase = asyncHandler(async (req, res, next) => {
  const cases = await Cases.create(req.body);
  req.charity.cases.push(cases._id);
  await req.charity.save();
  res.json(req.charity);
});
export { addCase };
