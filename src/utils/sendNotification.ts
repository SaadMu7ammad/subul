import { USER } from '@components/user/domain/user.class';
import mongoose from 'mongoose';

import {
  PlainNotification,
  ResourceType,
} from '../components/notification/data-access/interfaces/notification.interface';
import { NotificationRepository } from '../components/notification/data-access/notification.repository';

export class notificationManager {
  #notificationRepository = new NotificationRepository();

  #user = new USER();

  async sendNotification(
    receiverType: 'Charity' | 'User',
    receiverId: mongoose.Types.ObjectId | string,
    message: string,
    maxAge?: number,
    resourceType?: ResourceType,
    resourceId?: mongoose.Types.ObjectId
  ) {
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

    const notification = await this.#notificationRepository.createNotification(notificationData);

    return notification;
  }

  async notifyAllUsers(
    message: string,
    maxAge?: number,
    resourceType?: ResourceType,
    resourceId?: mongoose.Types.ObjectId
  ) {
    const users = await this.#user.userModel.getAllUsers();
    const notifications = [];

    for (const user of users) {
      const notification = await this.sendNotification(
        'User',
        user._id,
        message,
        maxAge,
        resourceType,
        resourceId
      );
      notifications.push(notification);
    }
  }
}
