import mongoose from 'mongoose';

import { PlainNotification } from '../components/notification/data-access/interfaces/notification.interface';
import { NotificationRepository } from '../components/notification/data-access/notification.repository';

const notificationRepository = new NotificationRepository();

export const sendNotification = async (
  receiverType: 'Charity' | 'User',
  receiverId: mongoose.Types.ObjectId,
  message: string,
  maxAge?: number,
  resourceType?: string,
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
