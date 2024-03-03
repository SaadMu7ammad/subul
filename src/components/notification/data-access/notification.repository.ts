import {
    Notification,
    NotificationDocument,
} from './interfaces/notification.interface.js';
import NotificationModel from './models/notification.model.js';

export class NotificationRepository {
    async getAllNotifications(receiverType: string, receiverId: string) {
        const notifications = await NotificationModel.find({
            'receiver.receiverType': receiverType,
            'receiver.receiverId': receiverId,
        });
        return notifications;
    }

    async createNotification(notificationData: Notification) {
        const notification = NotificationModel.create(notificationData);
        return notification;
    }

    async getNotificationById(
        receiverType: string,
        receiverId: string,
        notificationId: string
    ) {
        const notification: NotificationDocument | null =
            await NotificationModel.findOne({
                _id: notificationId,
                'receiver.receiverType': receiverType,
                'receiver.receiverId': receiverId,
            });
        return notification;
    }

    async deleteNotificationById(
        receiverType: string,
        receiverId: string,
        notificationId: string
    ) {
        const notification = await NotificationModel.findOneAndDelete({
            _id: notificationId,
            'receiver.receiverType': receiverType,
            'receiver.receiverId': receiverId,
        });
        return notification;
    }
}
