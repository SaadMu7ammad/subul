import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import Case from '../models/caseModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import { NotFoundError } from '../errors/not-found.js';
import logger from '../utils/logger.js';
const addCase = asyncHandler(async (req, res, next) => {
    if (!req.charity) {
        throw new UnauthenticatedError(
            'Users Are Not Authorized To Upload Cases!'
        );
    }
    const newCase = Case(req.body);
    newCase.charity = req.charity._id;
    newCase.imageCover = req.body.image;
    await newCase.save();
    req.charity.cases.push(newCase._id);
    await req.charity.save();
    res.json(newCase);
});
const getAllCases = asyncHandler(async (req, res, next) => {
    const populatedCharityObject = await req.charity.populate({
        path: 'cases',
        model: 'Cases',
        select: '-_id',
    });
    const charityCases = populatedCharityObject.cases;
    res.json(charityCases);
});

const getCaseById = asyncHandler(async (req, res, next) => {
    //caseId ,then fetch it from DB
    const caseIdsArray = req.charity.cases;
    const caseId = caseIdsArray.find(function(id){
      return id.toString() === req.params.caseId;
    });
    if (!caseId) {
        throw new NotFoundError('No Such Case With this Id!');
    }
    const _case = await Case.findById(caseId);
    res.json(_case);
});

export { addCase, getAllCases, getCaseById };
