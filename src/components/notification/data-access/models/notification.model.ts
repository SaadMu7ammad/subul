import mongoose, { Schema, Document } from 'mongoose';

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

const notificationSchema: Schema = new Schema({
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
    date: {
        type: Date,
        required: true,
    },
});

export default mongoose.model('Notification', notificationSchema);
