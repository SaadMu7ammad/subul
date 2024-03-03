import { NotFoundError } from "../../../libraries/errors/components/not-found.js";
import  {NotificationRepository}  from "../data-access/notification.repository.js";
const notificationRepository = new NotificationRepository();

const getAllNotifications = async (receiverType:string,receiverId:string) => {
    const notifications = await notificationRepository.getAllNotifications(receiverType, receiverId);
    return notifications;
}

const markNotificationAsRead = async (receiverType:string,receiverId:string,notificationId:string) => {
    const notification = await notificationRepository.getNotificationById(receiverType, receiverId, notificationId);
    
    if(!notification)throw new NotFoundError("Notification Not Found");

    notification.read = true;

    await notification.save();

    return notification;
}

const deleteNotification = async (receiverType:string,receiverId:string,notificationId:string) => {
    const notification = await notificationRepository.getNotificationById(receiverType, receiverId, notificationId);
    
    if(!notification)throw new NotFoundError("Notification Not Found");

    const deletedNotification = await notificationRepository.deleteNotificationById(receiverType, receiverId, notificationId);

    if(!deletedNotification)throw new NotFoundError("Notification Not Found");

    return notification;
}

export const notificationUtils = {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
};