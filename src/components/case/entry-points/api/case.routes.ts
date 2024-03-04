import express, { Application } from 'express';
import {
    imageAssertion,
    resizeImg,
} from '../../../../libraries/uploads/components/images/handlers';
import { postCaseValidation } from '../../../../libraries/validation/components/case/postCaseValidation';
import { editCaseValidation } from '../../../../libraries/validation/components/case/editCaseValidation';
import { validate } from '../../../../libraries/validation/index';
import { deleteOldImgs } from '../../../../utils/deleteFile';
import { auth, isConfirmed } from '../../../auth/shared/index';
import { caseUseCase } from '../../domain/case.use-case';
import logger from '../../../../utils/logger';
import { getAllCasesValidation } from '../../../../libraries/validation/components/case/getAllCasesValidation';

export default function defineRoutes(expressApp:Application) {
    const router = express.Router();

    router.post(
        '/addCase',
        auth,
        isConfirmed,
        imageAssertion,
        postCaseValidation,
        validate,
        resizeImg,
        async (req, res, next) => {
            try {
                logger.info(`Case API was called to Add Case`);
                const addCaseResponse = await caseUseCase.addCase(
                    req,
                    res,
                    next
                );
                return res.json(addCaseResponse);
            } catch (error) {
                deleteOldImgs('caseCoverImages', req.body.image);
                next(error);
                return undefined;
            }
        }
    );

    router.get(
        '/allCases',
        auth,
        isConfirmed,
        getAllCasesValidation,
        validate,
        async (req, res, next) => {
            try {
                logger.info(`Case API was called to Get All Cases`);
                const getAllCasesResponse = await caseUseCase.getAllCases(
                    req,
                    res,
                    next
                );
                return res.json(getAllCasesResponse);
            } catch (error) {
                next(error);
                return undefined;
            }
        }
    );

    router
        .route('/cases/:caseId')
        .get(auth, isConfirmed, async (req, res, next) => {
            try {
                logger.info(`Case API was called to Get Case By Id`);
                const getCaseByIdResponse = await caseUseCase.getCaseById(
                    req,
                    res,
                    next
                );
                return res.json(getCaseByIdResponse);
            } catch (error) {
                next(error);
                return undefined;
            }
        })
        .delete(auth, isConfirmed, async (req, res, next) => {
            try {
                logger.info(`Case API was called to Delete Case By Id`);
                const deleteCaseResponse = await caseUseCase.deleteCase(
                    req,
                    res,
                    next
                );
                return res.json(deleteCaseResponse);
            } catch (error) {
                next(error);
                return undefined;
            }
        })
        .put(
            auth,
            isConfirmed,
            imageAssertion,
            editCaseValidation,
            validate,
            resizeImg,
            async (req, res, next) => {
                try {
                    logger.info(`Case API was called to Edit Case`);
                    const editCaseResponse = await caseUseCase.editCase(
                        req,
                        res,
                        next
                    );
                    return res.json(editCaseResponse);
                } catch (error) {
                    const image = req.body.coverImage || req.body.image;
                    if (image) deleteOldImgs('caseCoverImages', image);
                    next(error);
                    return undefined;
                }
            }
        );

    expressApp.use('/api/charities', router);
}
