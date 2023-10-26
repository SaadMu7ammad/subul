import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import Case from '../models/caseModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import { NotFoundError } from '../errors/not-found.js';
import logger from '../utils/logger.js';
import { deleteFile } from '../utils/deleteFile.js';

const addCase = asyncHandler(async (req, res, next) => {
    if (!req.charity) {
        throw new UnauthenticatedError(
            'Users Are Not Authorized To Upload Cases!'
        );
    }
    const newCase = Case(req.body);
    newCase.charity = req.charity._id;
    newCase.imageCover = req.body.image;
    try {
        await newCase.save();
        req.charity.cases.push(newCase._id);
        await req.charity.save();
        res.json(newCase);
    } catch (err) {
        if (err) {
            deleteFile('./uploads/casesCoverImages/' + req.body.image);
            next(err);
        }
    }
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
    const caseIdsArray = req.charity.cases;
    const caseId = caseIdsArray.find(function (id) {
        return id.toString() === req.params.caseId;
    });
    if (!caseId) {
        throw new NotFoundError('No Such Case With this Id!');
    }
    const _case = await Case.findById(caseId);
    res.json(_case);
});

const deleteCase = asyncHandler(async (req, res, next) => {
    const caseIdsArray = req.charity.cases;
    const caseIdIndex = caseIdsArray.findIndex(function (id) {
        return id.toString() === req.params.caseId;
    });
    console.log(caseIdsArray);
    if (caseIdIndex === -1) {
        throw new NotFoundError('No Such Case With this Id!');
    }
    const caseId = req.charity.cases[caseIdIndex];
    const deletedCase = await Case.findByIdAndDelete(caseId);
    caseIdsArray.splice(caseIdIndex, 1);
    req.charity.cases = caseIdsArray;
    await req.charity.save();
    res.json(deletedCase);
});

const editCase = asyncHandler(async (req, res, next) => {
    
});

export { addCase, getAllCases, getCaseById, deleteCase };
