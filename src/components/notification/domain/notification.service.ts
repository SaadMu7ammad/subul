import { GetAllNotificationsQueryParams } from '../data-access/interfaces';
import { notificationUtils } from './notification.utils';

const getAllNotifications = async (
  receiverType: string,
  receiverId: string,
  queryParams: GetAllNotificationsQueryParams
) => {
  const sortObj = notificationUtils.getSortObj(queryParams.sort);

  const filterObj = notificationUtils.getFilterObj(
    receiverType,
    receiverId,
    queryParams
  );

  const paginationObj = notificationUtils.getPaginationObj(queryParams);

  const notifications = await notificationUtils.getAllNotifications(
    filterObj,
    sortObj,
    paginationObj
  );

  return {
    message: 'All Notifications Fetched Successfully',
    notifications: notifications,
  };
};

const markNotificationAsRead = async (
  receiverType: string,
  receiverId: string,
  notificationId: string | undefined
) => {
  const validateId: (id: string | undefined) => asserts id is string =
    notificationUtils.validateIdParam;
  validateId(notificationId);

  const notification = await notificationUtils.getNotification(
    receiverType,
    receiverId,
    notificationId
  );

  const readNotification = await notificationUtils.markNotificationAsRead(
    notification
  );

  return {
    message: 'Notification Is Marked as Read Successfully',
    notification: readNotification,
  };
};

const deleteNotification = async (
  receiverType: string,
  receiverId: string,
  notificationId: string | undefined
) => {
  const validateId: (id: string | undefined) => asserts id is string =
    notificationUtils.validateIdParam;
  validateId(notificationId);

  const notification = await notificationUtils.getNotification(
    receiverType,
    receiverId,
    notificationId
  );

  const deletedNotification = await notificationUtils.deleteNotification(
    receiverType,
    receiverId,
    notification
  );

  return {
    message: 'Notification Is Deleted Successfully',
    notification: deletedNotification,
  };
};

export const notificationService = {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
};
