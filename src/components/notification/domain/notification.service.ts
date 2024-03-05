import {notificationUtils} from './notification.utils.js';

const getAllNotifications = async (receiverType:string,receiverId:string,queryParams) => {
    const sortObj = notificationUtils.getSortObj(queryParams.sort);

    const paginationObj = notificationUtils.getPaginationObj(queryParams);

    const notifications = await notificationUtils.getAllNotifications(receiverType,receiverId,sortObj,paginationObj);

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

const deleteNotification = async (receiverType:string,receiverId:string,notificationId:string) => {
    const notification = await notificationUtils.deleteNotification(receiverType,receiverId,notificationId);

    return {
        message: "Notification Is Deleted Successfully",
        notification: notification,
    };
}


export const notificationService = {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
}; 