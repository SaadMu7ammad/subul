import express from 'express';
import {
    imageAssertion,
    resizeImg,
} from '../../../../libraries/uploads/components/images/handlers.js';
import { editCaseValidation } from '../../../../libraries/validation/components/case/editCaseValidation.js';
import { validate } from '../../../../libraries/validation/index.js';
import { deleteOldImgs } from '../../../../utils/deleteFile.js';
import { auth, isConfirmed } from '../../../auth/shared/index.js';
import {caseUseCase} from '../../domain/case.use-case.js';
import logger from '../../../../utils/logger.js';

export default function defineRoutes(expressApp) {
    const router = express.Router();

    router.post(
        '/addCase',
        auth,
        isConfirmed,
        imageAssertion,
        editCaseValidation,
        validate,
        resizeImg,
        async (req, res, next) => {
            try {
                logger.info(`Case API was called to get Add Case`);
                const addCaseResponse = await caseUseCase.addCase(
                    req,
                    res,
                    next
                );
                return res.json(addCaseResponse);
            } catch (error) {
                deleteOldImgs('casesCoverImages',req.body.image);
                next(error);
                return undefined;
            }
        }
    );

    expressApp.use('/api/charities', router);
}

