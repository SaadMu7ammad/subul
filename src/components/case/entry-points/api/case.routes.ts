import { auth, isConfirmed } from '@components/auth/shared/index';
import { caseUseCase } from '@components/case/domain/case.use-case';
import { imageAssertion, resizeImg } from '@libs/uploads/components/images/handlers';
import { editCaseValidation } from '@libs/validation/components/case/editCaseValidation';
import { getAllCasesValidation } from '@libs/validation/components/case/getAllCasesValidation';
import { postCaseValidation } from '@libs/validation/components/case/postCaseValidation';
import { validate } from '@libs/validation/index';
import { deleteOldImgs } from '@utils/deleteFile';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/addCase',
    auth,
    isConfirmed,
    imageAssertion,
    postCaseValidation,
    validate,
    resizeImg,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to Add Case`);
        const addCaseResponse = await caseUseCase.addCase(req, res, next);
        return res.json(addCaseResponse);
      } catch (error) {
        deleteOldImgs('caseCoverImages', req.body.image);
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/addBloodCase',
    auth,
    isConfirmed,
    postCaseValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(req.body);
        logger.info(`Case API was called to Add blood Case`);
        const addCaseResponse = await caseUseCase.addCase(req, res, next);
        return res.json(addCaseResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.get(
    '/allCasesOfCharity',
    auth,
    isConfirmed,
    getAllCasesValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to Get All Cases`);
        const getAllCasesResponse = await caseUseCase.getAllCases(req, res, next);
        return res.json(getAllCasesResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  // get all cases from all charities in the DB to user
  router.get(
    '/allCases',
    auth,
    getAllCasesValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to Get All Cases For User`);
        const getAllCasesResponse = await caseUseCase.getAllCasesForUser(req, res, next);
        return res.json(getAllCasesResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router
    .route('/cases/:caseId')
    .get(auth, isConfirmed, async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to Get Case By Id`);
        const getCaseByIdResponse = await caseUseCase.getCaseById(req, res, next);
        return res.json(getCaseByIdResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .delete(auth, isConfirmed, async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to Delete Case By Id`);
        const deleteCaseResponse = await caseUseCase.deleteCase(req, res, next);
        return res.json(deleteCaseResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .put(
      auth,
      isConfirmed,
      editCaseValidation,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info(`Case API was called to Edit Case`);
          const editCaseResponse = await caseUseCase.editCase(req, res, next);
          return res.json(editCaseResponse);
        } catch (error) {
          const image = req.body.coverImage || req.body.image;
          if (image) deleteOldImgs('caseCoverImages', image);
          next(error);
          return undefined;
        }
      }
    );
  router.put(
    '/caseCoverImg/:caseId',
    auth,
    isConfirmed,
    imageAssertion,
    resizeImg,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Case API was called to update coverImage Case`);
        const editCaseResponse = await caseUseCase.editCase(req, res, next);
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
