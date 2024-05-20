import { NotFoundError } from '../../../libraries/errors/components/not-found';
import { CharityRepository } from '../../charity/data-access/charity.repository';
import { userRepository as UserRepository } from '../../user/data-access/user.repository';
import { FilterObj, PaginationObj, PlainNotification, SortObj } from './interfaces';
import { NotificationDao } from './interfaces/';
import NotificationModel from './models/notification.model';

export class NotificationRepository implements NotificationDao {
  async getAllNotifications(filterObj: FilterObj, sortObj: SortObj, paginationObj: PaginationObj) {
    const notifications = await NotificationModel.aggregate([
      {
        $match: filterObj,
      },
      {
        $sort: sortObj,
      },
    ])
      .skip((paginationObj.page - 1) * paginationObj.limit)
      .limit(paginationObj.limit);
    return notifications;
  }

  async createNotification(notificationData: PlainNotification) {
    await checkIfReceiverExists(
      notificationData.receiver.receiverType,
      notificationData.receiver.receiverId.toString()
    );
    const notification = new NotificationModel(notificationData);
    await notification.save();
    return notification;
  }

  async getNotificationById(receiverType: string, receiverId: string, notificationId: string) {
    const notification = await NotificationModel.findOne({
      _id: notificationId,
      'receiver.receiverType': receiverType,
      'receiver.receiverId': receiverId,
    });
    return notification;
  }

  async deleteNotificationById(receiverType: string, receiverId: string, notificationId: string) {
    const notification = await NotificationModel.findByIdAndDelete({
      _id: notificationId,
      'receiver.receiverType': receiverType,
      'receiver.receiverId': receiverId,
    });
    return notification;
  }

  async deleteOutdatedNotifications(receiverType: string, receiverId: string) {
    const now = Date.now();
    await NotificationModel.deleteMany({
      receiver: {
        receiverType,
        receiverId,
      },
      $expr: {
        $gte: [
          { $subtract: [{ $toDate: now }, '$createdAt'] },
          { $ifNull: ['$maxAge', Number.MAX_SAFE_INTEGER] },
        ],
      },
    });
  }
}

const checkIfReceiverExists = async (receiverType: string, receiverId: string) => {
  if (receiverType === 'Charity') {
    const charityRepository = new CharityRepository();

    const charity = await charityRepository.findCharityById(receiverId);

    if (!charity) throw new NotFoundError('Charity Not Found');
  } else if (receiverType === 'User') {
    const userRepository = new UserRepository();

    const user = await userRepository.findUserById(receiverId);

    if (!user) throw new NotFoundError('User Not Found');
  }
};
