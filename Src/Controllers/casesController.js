import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import Cases from '../models/caseModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';

const addCase = asyncHandler(async (req, res, next) => {
  const newCase = await Cases.create(req.body);
  req.charity.cases.push(newCase._id);
  await req.charity.save();
  res.json(req.charity);
});
const getAllCases = asyncHandler(async (req, res, next) => {
  const _case = await req.charity.populate({
    path: 'cases',
    model: 'Cases',
    select: '-_id',
  }); //.exec();
  res.json(_case);
});

const getCaseById = asyncHandler(async (req, res, next) => {
  const _case = await Cases.findById(req.params.id);
  if (!_case) throw new BadRequestError('id not found');

  res.json(_case);
});
export { addCase, getAllCases, getCaseById };
