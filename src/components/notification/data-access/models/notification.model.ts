import mongoose, { Schema, Document } from 'mongoose';
import { INotificationModel, INotificationSchema,INotificationDocument } from '../interfaces/notification.interface';

const notificationReceiverSchema: Schema = new Schema(
    {
        receiverType: {
            type: String,
            required: true,
            enum: ['Charity', 'User'],
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'receiver.receiverType',
            required: true,
        },
    },
    { _id: false }
);

const notificationSchema: INotificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    receiver: {
        type: notificationReceiverSchema,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    maxAge:{//Expiry Date in MS
        type:Number,
        required : false,
    }
});

const NotificationModel : INotificationModel =  mongoose.model<INotificationDocument,INotificationModel>('Notification', notificationSchema);
export default NotificationModel;
