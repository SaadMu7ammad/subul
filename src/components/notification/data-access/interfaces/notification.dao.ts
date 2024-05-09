import {
  FilterObj,
  INotification,
  PaginationObj,
  PlainNotification,
  SortObj,
} from '.';

export type NotificationDao = {
  getAllNotifications: (
    filterObj: FilterObj,
    sortObj: SortObj,
    paginationObj: PaginationObj
  ) => Promise<INotification[]>;

  createNotification: (
    notificationData: PlainNotification
  ) => Promise<INotification>;
  
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
};
