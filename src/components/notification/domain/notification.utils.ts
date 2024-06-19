import mongoose from 'mongoose';

import { BadRequestError } from '../../../libraries/errors/components/bad-request';
import { NotFoundError } from '../../../libraries/errors/components/not-found';
import {
  FilterObj,
  GetAllNotificationsQueryParams,
  INotification,
  PaginationObj,
  ReceiverType,
  SortObj,
} from '../data-access/interfaces/notification.interface';
import { NotificationRepository } from '../data-access/notification.repository';

const notificationRepository = new NotificationRepository();

const getAllNotifications = async (
  filterObj: FilterObj,
  sortObj: SortObj,
  paginationObj: PaginationObj
) => {
  const notifications = await notificationRepository.getAllNotifications(
    filterObj,
    sortObj,
    paginationObj
  );
  return notifications;
};

const markNotificationAsRead = async (notification: INotification) => {
  notification.read = true;

  await notification.save();

  return notification;
};

const deleteNotification = async (
  receiverType: string,
  receiverId: string,
  notification: INotification
) => {
  const deletedNotification = await notificationRepository.deleteNotificationById(
    receiverType,
    receiverId,
    notification._id.toString()
  );

  if (!deletedNotification) throw new NotFoundError('Notification Not Found');

  return notification;
};

const getSortObj = (sortQueryParams: string | undefined) => {
  const sortBy = sortQueryParams || 'createdAt';

  const sortArray = sortBy.split(',');

  const sortObj: SortObj = {};
  sortArray.forEach(function (sort) {
    if (sort[0] === '-') {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }
  });

  return sortObj;
};

const getPaginationObj = (queryParams: GetAllNotificationsQueryParams) => {
  const limit = queryParams?.limit ? +queryParams.limit : 10;

  const page = queryParams?.page ? +queryParams.page : 1;

  const offset = queryParams?.offset ? +queryParams.offset : 0;

  return { limit, page, offset };
};

const getFilterObj = (
  receiverType: string,
  receiverId: string,
  queryParams: GetAllNotificationsQueryParams
) => {
  const filterObject: FilterObj = {
    receiver: {
      receiverType,
      receiverId: new mongoose.Types.ObjectId(receiverId),
    },
  };

  if (queryParams.read) {
    filterObject['read'] = queryParams.read === 'true';
  }

  return filterObject;
};

const getNotification = async (
  receiverType: string,
  receiverId: string,
  notificationId: string
) => {
  const notification = await notificationRepository.getNotificationById(
    receiverType,
    receiverId,
    notificationId
  );

  if (!notification) throw new NotFoundError('Notification Not Found');

  return notification;
};

const validateIdParam = (id: string | undefined): asserts id is string => {
  if (!id) {
    throw new BadRequestError('No id provided');
  }
};

const deleteOutdatedNotifications = async (receiverType: ReceiverType, receiverId: string) => {
  await notificationRepository.deleteOutdatedNotifications(receiverType, receiverId);
};

export const notificationUtils = {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  getSortObj,
  getPaginationObj,
  getFilterObj,
  getNotification,
  validateIdParam,
  deleteOutdatedNotifications,
};
