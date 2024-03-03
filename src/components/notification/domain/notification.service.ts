import {notificationUtils} from './notification.utils.js';

const getAllNotifications = async (receiverType:string,receiverId:string) => {
    const notifications = await notificationUtils.getAllNotifications(receiverType,receiverId);

    return {
        message: "All Notifications Fetched Successfully",
        notifications: notifications,
    };
}

const markNotificationAsRead = async (receiverType:string,receiverId:string,notificationId:string) => {
    const notification = await notificationUtils.markNotificationAsRead(receiverType,receiverId,notificationId);

    return {
        message: "Notification Is Marked as Read Successfully",
        notification: notification,
    };
}


export const notificationService = {
    getAllNotifications,
    markNotificationAsRead
}; 