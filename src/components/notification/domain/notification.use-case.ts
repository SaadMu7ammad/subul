import { NextFunction, Request, Response } from 'express';

import {
  GetAllNotificationsQueryParams,
  ReceiverType,
} from '../data-access/interfaces/notification.interface';
import { notificationService } from './notification.service';

const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const receiverId = res.locals.charity?._id || res.locals.user?._id;
  const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';
  const queryParams: GetAllNotificationsQueryParams = req.query;

  const responseData = await notificationService.getAllNotifications(
    receiverType,
    receiverId.toString(),
    queryParams
  );

  return {
    message: responseData.message,
    notifications: responseData.notifications,
  };
};

const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  const receiverId = res.locals.charity?._id || res.locals.user?._id;
  const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';

  const notificationId = req.params.id;

  const responseData = await notificationService.markNotificationAsRead(
    receiverType,
    receiverId.toString(),
    notificationId
  );

  return {
    message: responseData.message,
    notification: responseData.notification,
  };
};

const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  const receiverId = res.locals.charity?._id || res.locals.user?._id;
  const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';

  const notificationId = req.params.id;

  const responseData = await notificationService.deleteNotification(
    receiverType,
    receiverId.toString(),
    notificationId
  );

  return {
    message: responseData.message,
    notification: responseData.notification,
  };
};
export const notificationUseCase = {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
};
