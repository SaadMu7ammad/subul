import { NextFunction, Request, Response } from 'express';

import {
  FilterObj,
  GetAllNotificationsQueryParams,
  INotification,
  PaginationObj,
  PlainNotification,
  ReceiverType,
  SortObj,
} from '.';

export type NotificationDao = {
  getAllNotifications: (
    filterObj: FilterObj,
    sortObj: SortObj,
    paginationObj: PaginationObj
  ) => Promise<INotification[]>;

  createNotification: (notificationData: PlainNotification) => Promise<INotification>;

  getNotificationById: (
    receiverType: string,
    receiverId: string,
    notificationId: string
  ) => Promise<INotification | null>;

  deleteNotificationById: (
    receiverType: string,
    receiverId: string,
    notificationId: string
  ) => Promise<INotification | null>;

  deleteOutdatedNotifications: (receiverType: string, receiverId: string) => Promise<void>;
};

export interface notificationServiceSkeleton {
  getAllNotifications(
    receiverType: ReceiverType,
    receiverId: string,
    queryParams: GetAllNotificationsQueryParams
  ): Promise<{
    message: string;
    notifications: INotification[];
  }>;

  markNotificationAsRead(
    receiverType: string,
    receiverId: string,
    notificationId: string | undefined
  ): Promise<{
    message: string;
    notification: INotification;
  }>;
  deleteNotification(
    receiverType: string,
    receiverId: string,
    notificationId: string | undefined
  ): Promise<{
    message: string;
    notification: INotification;
  }>;
}

export interface notificationUseCaseSkeleton {
  getAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notifications: INotification[];
  }>;

  markNotificationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notification: INotification;
  }>;

  deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{
    message: string;
    notification: INotification;
  }>;
}

export interface notificationUtilsSkeleton {
  getAllNotifications(
    filterObj: FilterObj,
    sortObj: SortObj,
    paginationObj: PaginationObj
  ): Promise<INotification[]>;

  markNotificationAsRead(notification: INotification): Promise<INotification>;
  deleteNotification(
    receiverType: string,
    receiverId: string,
    notification: INotification
  ): Promise<INotification>;

  getSortObj(sortQueryParams: string | undefined): SortObj;

  getPaginationObj(queryParams: GetAllNotificationsQueryParams): {
    limit: number;
    page: number;
    offset: number;
  };

  getFilterObj(
    receiverType: string,
    receiverId: string,
    queryParams: GetAllNotificationsQueryParams
  ): FilterObj;
  getNotification(
    receiverType: string,
    receiverId: string,
    notificationId: string
  ): Promise<INotification>;

  validateIdParam(id: string | undefined): asserts id is string;

  deleteOutdatedNotifications(receiverType: ReceiverType, receiverId: string): Promise<void>;
}
