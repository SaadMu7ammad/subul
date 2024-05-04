import express, { Application, NextFunction, Request, Response } from 'express';
import logger from '../../../../utils/logger';
import { usedItemUseCase } from '../../domain/used-item.use-case';
import { auth, isActivated, isUser } from '../../../auth/shared';
import { addUsedItemValidation } from '../../../../libraries/validation/components/used-items/addUsedItemValidation';
import { validate } from '../../../../libraries/validation';
import { editUsedItemValidation } from '../../../../libraries/validation/components/used-items/editUsedItemValidation';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/',
    auth,
    isActivated,
    isUser,
    addUsedItemValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Create Used Item`);
        const createUsedItemResponse = await usedItemUseCase.addUsedItem(
          req,
          res,
          next
        );
        return res.json(createUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router
    .route('/:id')
    .all(auth, isActivated, isUser)
    .delete(async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Delete Used Item`);
        const logOutResponse = await usedItemUseCase.deleteUsedItem(
          req,
          res,
          next
        );
        return res.json(logOutResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .put(editUsedItemValidation,validate,async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Update Used Item`);
        const updateUsedItemResponse = await usedItemUseCase.updateUsedItem(
          req,
          res,
          next
        );
        return res.json(updateUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Get Used Item`);
        const getUsedItemResponse = await usedItemUseCase.getUsedItem(
          req,
          res,
          next
        );
        return res.json(getUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    });

  expressApp.use('/api/usedItem', router);
}
