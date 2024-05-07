import express, { Application, NextFunction, Request, Response } from 'express';
import logger from '../../../../utils/logger';
import { usedItemUseCase } from '../../domain/used-item.use-case';
import { auth, isActivated, isUser } from '../../../auth/shared';
import { addUsedItemValidation } from '../../../../libraries/validation/components/used-items/addUsedItemValidation';
import { validate } from '../../../../libraries/validation';
import { editUsedItemValidation } from '../../../../libraries/validation/components/used-items/editUsedItemValidation';
import {
  imageAssertion,
  resizeImg,
} from '../../../../libraries/uploads/components/images/usedItemImageHandler';
import { deleteOldImgs } from '../../../../utils/deleteFile';
import { deleteUsedItemImageValidation } from '../../../../libraries/validation/components/used-items/deleteUsedItemImageValidation';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/',
    auth,
    isActivated,
    isUser,
    imageAssertion,
    resizeImg,
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
        deleteOldImgs('usedItemsImages', req.body.images);
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
  router
    .route('/:id')
    .all(auth, isActivated, isUser)
    .delete(async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Delete Used Item`);
        const deleteUsedItemResponse = await usedItemUseCase.deleteUsedItem(
          req,
          res,
          next
        );
        return res.json(deleteUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .put(
      editUsedItemValidation,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
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
      }
    )
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

  router
    .route('/:id/images')
    .all(auth, isActivated, isUser)
    .post(
      imageAssertion,
      resizeImg,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info(`Used Items API was called to Add Used Item Images`);
          const addUsedItemImagesResponse =
            await usedItemUseCase.addUsedItemImages(req, res, next);
          return res.json(addUsedItemImagesResponse);
        } catch (error) {
          deleteOldImgs('usedItemsImages', req.body.images);
          next(error);
          return undefined;
        }
      }
    )
    .delete(
      deleteUsedItemImageValidation,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info(`Used Items API was called to Delete a Used Item Image`);
          const deleteUsedItemImageResponse =
            await usedItemUseCase.deleteUsedItemImage(req, res, next);
          return res.json(deleteUsedItemImageResponse);
        } catch (error) {
          next(error);
          return undefined;
        }
      }
    );

  expressApp.use('/api/usedItem', router);
}
