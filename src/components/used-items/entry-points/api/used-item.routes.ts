import express, { Application, NextFunction, Request, Response } from 'express';
import logger from '../../../../utils/logger';
import { usedItemUseCase } from '../../domain/used-item.use-case';
import { auth, isActivated } from '../../../auth/shared';
export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Create Used Item`);
        const createUsedItemResponse= await usedItemUseCase.addUsedItem(req, res, next);
        return res.json(createUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.delete(
    '/:id',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Delete Used Item`);
        const logOutResponse = await usedItemUseCase.deleteUsedItem(req, res, next);
        return res.json(logOutResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/usedItem', router);
}
