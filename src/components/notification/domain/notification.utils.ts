import  {NotificationRepository}  from "../data-access/notification.repository.js";
const notificationRepository = new NotificationRepository();

const getAllNotifications = async (receiverType:string,receiverId:string) => {
    const notifications = await notificationRepository.getAllNotifications(receiverType, receiverId);
    return notifications;
}

export const notificationUtils = {
    getAllNotifications,
};