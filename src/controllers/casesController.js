import asyncHandler from 'express-async-handler';
import Charity from '../components/charity/data-access/models/charity.model.js';
import Case from '../models/caseModel.js';
import { BadRequestError } from '../libraries/errors/components/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { NotFoundError } from '../libraries/errors/components/index.js';
import logger from '../utils/logger.js';
import { deleteOldImgs } from '../utils/deleteFile.js';


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
