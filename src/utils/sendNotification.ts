import { Notification } from "../components/notification/data-access/interfaces/notification.interface.js";
import { NotificationRepository } from "../components/notification/data-access/notification.repository.js";
import mongoose from "mongoose";
const notificationRepository = new NotificationRepository();

export const sendNotification = async (receiverType:"Charity"|"User",receiverId:mongoose.Types.ObjectId,title: string, message: string,maxAge?:number) => {
    const notificationData:Notification = {
        receiver: {
            receiverType: receiverType,
            receiverId: receiverId,
        },
        title: title,
        message: message,
        createdAt: Date.now(),
    };

    if(maxAge)notificationData.maxAge = maxAge;

    const notification = await notificationRepository.createNotification(notificationData);

    return notification;
}
