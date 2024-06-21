import mongoose from 'mongoose';

import {
  PlainNotification,
  ResourceType,
} from '../components/notification/data-access/interfaces/notification.interface';
import { NotificationRepository } from '../components/notification/data-access/notification.repository';
import { userRepository as UserRepository } from '../components/user/data-access/user.repository';

const notificationRepository = new NotificationRepository();

const userRepository = new UserRepository();

export const sendNotification = async (
  receiverType: 'Charity' | 'User',
  receiverId: mongoose.Types.ObjectId,
  message: string,
  maxAge?: number,
  resourceType?: ResourceType,
  resourceId?: mongoose.Types.ObjectId
) => {
  const notificationData: PlainNotification = {
    receiver: {
      receiverType: receiverType,
      receiverId: receiverId,
    },
    message: message,
    read: false,
  };

  if (maxAge) notificationData.maxAge = maxAge;

  if (resourceType && resourceId) {
    notificationData.resource = {
      type: resourceType,
      id: resourceId,
    };
  }

  const notification = await notificationRepository.createNotification(notificationData);

  return notification;
};

export const notifyAllUsers = async (
  message: string,
  maxAge?: number,
  resourceType?: ResourceType,
  resourceId?: mongoose.Types.ObjectId
) => {
  const users = await userRepository.getAllUsers();
  const notifications = [];

  for (const user of users) {
    const notification = await sendNotification(
      'User',
      user._id,
      message,
      maxAge,
      resourceType,
      resourceId
    );
    notifications.push(notification);
  }
};
