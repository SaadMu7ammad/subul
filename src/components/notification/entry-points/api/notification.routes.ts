import express, { Application, NextFunction, Request, Response } from 'express';

import logger from '../../../../utils/logger';
import { auth, isActivated } from '../../../auth/shared/index';
import { notificationUseCaseClass } from '../../domain/notification.use-case';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();
  const notificationUseCaseInstance = new notificationUseCaseClass();
  router.get('/', auth, isActivated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Notification API was called to get all notifications`);
      const getAllNotificationsResponse = await notificationUseCaseInstance.getAllNotifications(
        req,
        res,
        next
      );
      return res.json(getAllNotificationsResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  router
    .route('/:id')
    .put(auth, isActivated, async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Notification API was called to mark notification as read`);
        const markNotificationAsReadResponse =
          await notificationUseCaseInstance.markNotificationAsRead(req, res, next);
        return res.json(markNotificationAsReadResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    })
    .delete(auth, isActivated, async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Notification API was called to delete notification`);
        const deleteNotificationResponse = await notificationUseCaseInstance.deleteNotification(
          req,
          res,
          next
        );
        return res.json(deleteNotificationResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    });
  expressApp.use('/api/notifications', router);
}
