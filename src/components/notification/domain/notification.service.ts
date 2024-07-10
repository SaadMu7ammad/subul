import {
  GetAllNotificationsQueryParams,
  INotification,
  ReceiverType,
  notificationServiceSkeleton,
} from '../data-access/interfaces';
import { notificationUtilsClass } from './notification.utils';

export class notificationServiceClass implements notificationServiceSkeleton {
  notificationUtilsInstance: notificationUtilsClass;

  constructor() {
    this.notificationUtilsInstance = new notificationUtilsClass();
  }
  async getAllNotifications(
    receiverType: ReceiverType,
    receiverId: string,
    queryParams: GetAllNotificationsQueryParams
  ): Promise<{
    message: string;
    notifications: INotification[];
  }> {
    const sortObj = this.notificationUtilsInstance.getSortObj(queryParams.sort);

    const filterObj = this.notificationUtilsInstance.getFilterObj(
      receiverType,
      receiverId,
      queryParams
    );

    const paginationObj = this.notificationUtilsInstance.getPaginationObj(queryParams);

    await this.notificationUtilsInstance.deleteOutdatedNotifications(receiverType, receiverId);

    const notifications = await this.notificationUtilsInstance.getAllNotifications(
      filterObj,
      sortObj,
      paginationObj
    );

    return {
      message: 'All Notifications Fetched Successfully',
      notifications: notifications,
    };
  }

  async markNotificationAsRead(
    receiverType: string,
    receiverId: string,
    notificationId: string | undefined
  ): Promise<{
    message: string;
    notification: INotification;
  }> {
    const validateId: (id: string | undefined) => asserts id is string =
      this.notificationUtilsInstance.validateIdParam;
    validateId(notificationId);

    const notification = await this.notificationUtilsInstance.getNotification(
      receiverType,
      receiverId,
      notificationId
    );

    const readNotification =
      await this.notificationUtilsInstance.markNotificationAsRead(notification);

    return {
      message: 'Notification Is Marked as Read Successfully',
      notification: readNotification,
    };
  }

  async deleteNotification(
    receiverType: string,
    receiverId: string,
    notificationId: string | undefined
  ): Promise<{
    message: string;
    notification: INotification;
  }> {
    const validateId: (id: string | undefined) => asserts id is string =
      this.notificationUtilsInstance.validateIdParam;
    validateId(notificationId);

    const notification = await this.notificationUtilsInstance.getNotification(
      receiverType,
      receiverId,
      notificationId
    );

    const deletedNotification = await this.notificationUtilsInstance.deleteNotification(
      receiverType,
      receiverId,
      notification
    );

    return {
      message: 'Notification Is Deleted Successfully',
      notification: deletedNotification,
    };
  }
}
