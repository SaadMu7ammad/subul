import mongoose from 'mongoose';

import { BadRequestError } from '../../../libraries/errors/components/bad-request';
import { NotFoundError } from '../../../libraries/errors/components/not-found';
import { notificationUtilsSkeleton } from '../data-access/interfaces';
import {
  FilterObj,
  GetAllNotificationsQueryParams,
  INotification,
  PaginationObj,
  ReceiverType,
  SortObj,
} from '../data-access/interfaces/notification.interface';
import { NotificationRepository } from '../data-access/notification.repository';

export class notificationUtilsClass implements notificationUtilsSkeleton {
  notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getAllNotifications(
    filterObj: FilterObj,
    sortObj: SortObj,
    paginationObj: PaginationObj
  ): Promise<INotification[]> {
    const notifications = await this.notificationRepository.getAllNotifications(
      filterObj,
      sortObj,
      paginationObj
    );
    return notifications;
  }

  async markNotificationAsRead(notification: INotification): Promise<INotification> {
    notification.read = true;

    await notification.save();

    return notification;
  }

  async deleteNotification(
    receiverType: string,
    receiverId: string,
    notification: INotification
  ): Promise<INotification> {
    const deletedNotification = await this.notificationRepository.deleteNotificationById(
      receiverType,
      receiverId,
      notification._id.toString()
    );

    if (!deletedNotification) throw new NotFoundError('Notification Not Found');

    return notification;
  }

  getSortObj(sortQueryParams: string | undefined): SortObj {
    const sortBy = sortQueryParams || 'createdAt';

    const sortArray = sortBy.split(',');

    const sortObj: SortObj = {};
    sortArray.forEach(function (sort) {
      if (sort[0] === '-') {
        sortObj[sort.substring(1)] = -1;
      } else {
        sortObj[`${sort}`] = 1;
      }
    });

    return sortObj;
  }

  getPaginationObj(queryParams: GetAllNotificationsQueryParams): {
    limit: number;
    page: number;
    offset: number;
  } {
    const limit = queryParams?.limit ? +queryParams.limit : 10;

    const page = queryParams?.page ? +queryParams.page : 1;

    const offset = queryParams?.offset ? +queryParams.offset : 0;

    return { limit, page, offset };
  }

  getFilterObj(
    receiverType: string,
    receiverId: string,
    queryParams: GetAllNotificationsQueryParams
  ): FilterObj {
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
  }

  async getNotification(
    receiverType: string,
    receiverId: string,
    notificationId: string
  ): Promise<INotification> {
    const notification = await this.notificationRepository.getNotificationById(
      receiverType,
      receiverId,
      notificationId
    );

    if (!notification) throw new NotFoundError('Notification Not Found');

    return notification;
  }

  validateIdParam(id: string | undefined): asserts id is string {
    if (!id) {
      throw new BadRequestError('No id provided');
    }
  }

  async deleteOutdatedNotifications(receiverType: ReceiverType, receiverId: string): Promise<void> {
    await this.notificationRepository.deleteOutdatedNotifications(receiverType, receiverId);
  }
}
