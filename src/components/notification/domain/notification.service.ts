import {notificationUtils} from './notification.utils.js';

const getAllNotifications = async (receiverType:string,receiverId:string) => {
    const notifications = await notificationUtils.getAllNotifications(receiverType,receiverId);

    return {
        message: "All Notifications Fetch Successfully",
        notifications: notifications,
    };
}


export const notificationService = {
    getAllNotifications,
}; 