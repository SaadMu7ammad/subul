import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import Case from '../models/caseModel.js';
import { BadRequestError } from '../errors/components/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { NotFoundError } from '../errors/components/index.js';
import logger from '../utils/logger.js';
import { deleteOldImgs } from '../utils/deleteFile.js';

const addCase = asyncHandler(async (req, res, next) => {
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
      deleteOldImgs('casesCoverImages', req.body.image);
      next(err);
    }
  }
});

const getAllCases = asyncHandler(async (req, res, next) => {
  //ToDo : Sanitizing Req Query Params
  ///////Sorting//////
  const sortBy = req.query.sort || 'upVotes';
  const sortArray = sortBy.split(',');
  const sortObject = {};
  sortArray.forEach(function (sort) {
    if (sort[0] === '-') {
      sortObject[sort.substring(1)] = -1;
    } else {
      sortObject[sort] = 1;
    }
  });
  ///////Filtering///////
  const filterObject = { charity: req.charity._id };
  const queryParameters = ['mainType', 'subType', 'nestedSubType'];

  for (const param of queryParameters) {
    if (req.query[param]) {
      filterObject[param] = req.query[param];
    }
  }
  //////Paginating/////
  const pageLimit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  ///////////////////////
  const charityCases = await Case.aggregate([
    {
      $match: filterObject,
    },
    {
      $sort: sortObject,
    },
  ])
    .skip((page - 1) * pageLimit)
    .limit(pageLimit)
    .project(
      '-gender -upVotes -views -dateFinished -donationNumbers -helpedNumbers -freezed -createdAt -updatedAt -__v'
    );

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

  if (caseIdIndex === -1) {
    throw new NotFoundError('No Such Case With this Id!');
  }

  const caseId = req.charity.cases[caseIdIndex];

  const deletedCase = await Case.findByIdAndDelete(caseId);

  caseIdsArray.splice(caseIdIndex, 1);

  req.charity.cases = caseIdsArray;

  await req.charity.save();

  deleteOldImgs('casesCoverImages', deletedCase.imageCover);

  res.json(deletedCase);
});

const editCase = asyncHandler(async (req, res, next) => {
  try {
    const caseIdsArray = req.charity.cases;

    const caseIdIndex = caseIdsArray.findIndex(function (id) {
      return id.toString() === req.params.caseId;
    });
    if (caseIdIndex === -1) {
      throw new NotFoundError('No Such Case With this Id!');
    }

    const caseId = req.charity.cases[caseIdIndex];

    let oldCoverImage;
    if (req.file) {
      req.body.imageCover = req.body.image;
      const caseObject = await Case.findById(caseId);
      if (caseObject.imageCover) {
        oldCoverImage = caseObject.imageCover;
      }
    }

    let updatedCase;
    updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (oldCoverImage) {
      deleteOldImgs('casesCoverImages', oldCoverImage);
    }

    res.json(updatedCase);
  } catch (err) {
    if (err) {
      const image = req.body.imageCover || req.body.image;
      if (image) deleteOldImgs('casesCoverImages', image);
      next(err);
    }
  }
});

export { addCase, getAllCases, getCaseById, deleteCase, editCase };
