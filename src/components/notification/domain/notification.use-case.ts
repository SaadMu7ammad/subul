import mongoose from "mongoose";
import { notificationService } from "./notification.service.js";

const getAllNotifications = async (req,res,next) => {
    const receiverId:mongoose.Types.ObjectId = req.charity?._id || req.user?._id;
    const receiverType : "Charity" | "User"  = req.charity ? "Charity" : "User";

    const responseData = await notificationService.getAllNotifications(receiverType,receiverId.toString());

    return {
        message: responseData.message,
        notifications: responseData.notifications,
    };
}

const markNotificationAsRead = async (req,res,next) => {
    const receiverId:mongoose.Types.ObjectId = req.charity?._id || req.user?._id;
    const receiverType = req.charity ? "Charity" : "User";

    const notificationId = req.params.id;

    const responseData = await notificationService.markNotificationAsRead(receiverType,receiverId.toString(),notificationId);

    return {
        message: responseData.message,
        notification: responseData.notification,
    };
}
export const notificationUseCase = {
    getAllNotifications,
    markNotificationAsRead
};