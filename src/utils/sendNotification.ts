import { INotification } from '../components/notification/data-access/interfaces/notification.interface.js';
import { NotificationRepository } from '../components/notification/data-access/notification.repository.js';
import mongoose from 'mongoose';
import { NotFoundError } from '../libraries/errors/components/not-found.js';
const notificationRepository = new NotificationRepository();

export const sendNotification = async (
    receiverType: 'Charity' | 'User',
    receiverId: mongoose.Types.ObjectId,
    title: string,
    message: string,
    maxAge?: number
) => {
    //TODO: Remove This later.
    //@ts-ignore
    const notificationData: INotification = {
        receiver: {
            receiverType: receiverType,
            receiverId: receiverId,
        },
        title: title,
        message: message,
        createdAt: Date.now(),
    };

    if (maxAge) notificationData.maxAge = maxAge;

    const notification = await notificationRepository.createNotification(
        notificationData
    );

    if (maxAge) {
        scheduleNotificationDeletion(
            receiverType,
            receiverId.toHexString(),
            notification._id.toString(),
            maxAge
        );
    }

    return notification;
};

const scheduleNotificationDeletion = (
    receiverType: string,
    receiverId: string,
    notificationId: string,
    maxAge: number
) => {
    setTimeout(async () => {
        try {
            const notification =
                await notificationRepository.deleteNotificationById(
                    receiverType,
                    receiverId,
                    notificationId
                );
            if (notification) {
                console.log(
                    `notification with ID ${notificationId} has been deleted.`
                );
            } else {
                throw new NotFoundError(
                    `notification with ID ${notificationId} not found.`
                );
            }
        } catch (error) {
            console.error(
                `Error deleting notification with ID ${notificationId}:`,
                error
            );
        }
    }, maxAge);
};
