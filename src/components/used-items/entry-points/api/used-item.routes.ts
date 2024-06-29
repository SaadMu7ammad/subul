import { auth, isActivated, isUser } from '@components/auth/shared';
import { usedItemUseCaseClass } from '@components/used-items/domain/used-item.use-case';
import { imageAssertion, resizeImg } from '@libs/uploads/components/images/usedItemImageHandler';
import { validate } from '@libs/validation';
import { addUsedItemValidation } from '@libs/validation/components/used-items/addUsedItemValidation';
import { deleteUsedItemImageValidation } from '@libs/validation/components/used-items/deleteUsedItemImageValidation';
import { editUsedItemValidation } from '@libs/validation/components/used-items/editUsedItemValidation';
import { deleteOldImgs } from '@utils/deleteFile';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();
  const usedItemUseCaseInstance = new usedItemUseCaseClass();
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
        const createUsedItemResponse = await usedItemUseCaseInstance.addUsedItem(req, res, next);
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
        const getAllUsedItemsResponse = await usedItemUseCaseInstance.getAllUsedItems();
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
        const deleteUsedItemResponse = await usedItemUseCaseInstance.deleteUsedItem(req, res, next);
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
          const updateUsedItemResponse = await usedItemUseCaseInstance.updateUsedItem(
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
        const getUsedItemResponse = await usedItemUseCaseInstance.getUsedItem(req, res, next);
        return res.json(getUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    });

  router
    .route('/:id/images')
    .all(auth, isActivated, isUser)
    .post(imageAssertion, resizeImg, async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Add Used Item Images`);
        const addUsedItemImagesResponse = await usedItemUseCaseInstance.addUsedItemImages(
          req,
          res,
          next
        );
        return res.json(addUsedItemImagesResponse);
      } catch (error) {
        deleteOldImgs('usedItemsImages', req.body.images);
        next(error);
        return undefined;
      }
    })
    .put(
      deleteUsedItemImageValidation,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info(`Used Items API was called to Delete a Used Item Image`);
          const deleteUsedItemImageResponse = await usedItemUseCaseInstance.deleteUsedItemImage(
            req,
            res,
            next
          );
          return res.json(deleteUsedItemImageResponse);
        } catch (error) {
          next(error);
          return undefined;
        }
      }
    );

  expressApp.use('/api/usedItem', router);
}
