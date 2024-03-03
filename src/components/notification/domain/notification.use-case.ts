import { notificationService } from "./notification.service";

const getAllNotifications = async (req,res,next) => {
    const id = req.charity?._id || req.user?._id;
    const receiverType = req.charity ? "Charity" : "User";

    const responseData = await notificationService.getAllNotifications(receiverType,id);

    return {
        message: responseData.message,
        notifications: responseData.notifications,
    };
}

export const notificationUseCase = {
    getAllNotifications,
};