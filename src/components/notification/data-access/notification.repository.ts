import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { CharityRepository } from '../../charity/data-access/charity.repository.js';
import { userRepository } from '../../user/data-access/user.repository.js';
import {
    INotification,
    INotificationDocument,
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

    async createNotification(notificationData: INotification) {
        checkIfReceiverExists(
            notificationData.receiver.receiverType,
            notificationData.receiver.receiverId.toString()
        );
        const notification = new NotificationModel(notificationData);
        await notification.save();
        return notification;
    }

    async getNotificationById(
        receiverType: string,
        receiverId: string,
        notificationId: string
    ) {
        const notification: INotificationDocument | null =
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

const checkIfReceiverExists = async (
    receiverType: string,
    receiverId: string
) => {
    if (receiverType === 'Charity') {
        const charityRepository = new CharityRepository();
        const charity = await charityRepository.findCharityById(receiverId);
        if (!charity) throw new NotFoundError('Charity Not Found');
    } else if (receiverType === 'User') {
        const _userRepository = new userRepository();
        const user = await _userRepository.findUserById(receiverId);
        if (!user) throw new NotFoundError('User Not Found');
    }
};
