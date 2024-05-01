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
        const logOutResponse = await usedItemUseCase.addUsedItem(
          req,
          res,
          next
        );
        return res.json(logOutResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/getAllUsedItems',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Get All Used Items`);
        const getAllUsedItemsResponse = await usedItemUseCase.getAllUsedItems(
          req,
          res,
          next
        );
        return res.json(getAllUsedItemsResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/usedItem', router);
}
