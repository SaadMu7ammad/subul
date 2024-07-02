import { NextFunction, Request, Response } from 'express';

import { notificationUseCaseSkeleton } from '../data-access/interfaces';
import {
  GetAllNotificationsQueryParams,
  INotification,
  ReceiverType,
} from '../data-access/interfaces/notification.interface';
import { notificationServiceClass } from './notification.service';

export class notificationUseCaseClass implements notificationUseCaseSkeleton {
  notificationServiceInstance: notificationServiceClass;

  constructor() {
    this.notificationServiceInstance = new notificationServiceClass();
  }
  async getAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notifications: INotification[];
  }> {
    const receiverId = res.locals.charity?._id || res.locals.user?._id;
    const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';
    const queryParams: GetAllNotificationsQueryParams = req.query;

    const responseData = await this.notificationServiceInstance.getAllNotifications(
      receiverType,
      receiverId.toString(),
      queryParams
    );

    return {
      message: responseData.message,
      notifications: responseData.notifications,
    };
  }

  async markNotificationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notification: INotification;
  }> {
    const receiverId = res.locals.charity?._id || res.locals.user?._id;
    const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';

    const notificationId = req.params.id;

    const responseData = await this.notificationServiceInstance.markNotificationAsRead(
      receiverType,
      receiverId.toString(),
      notificationId
    );

    return {
      message: responseData.message,
      notification: responseData.notification,
    };
  }

  async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notification: INotification;
  }> {
    const receiverId = res.locals.charity?._id || res.locals.user?._id;
    const receiverType: ReceiverType = res.locals.charity ? 'Charity' : 'User';

    const notificationId = req.params.id;

    const responseData = await this.notificationServiceInstance.deleteNotification(
      receiverType,
      receiverId.toString(),
      notificationId
    );

    return {
      message: responseData.message,
      notification: responseData.notification,
    };
  }
}
// export const notificationUseCase = {
//   getAllNotifications,
//   markNotificationAsRead,
//   deleteNotification,
// };
