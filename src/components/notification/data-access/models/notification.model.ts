import mongoose, { Schema, Document } from 'mongoose';

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
        receiverType: {
            type: String,
            required: true,
            enum: ['charity', 'User', 'Admin'],
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'receiver.receiverType',
            required: true,
        }
    },
    date: {
        type: Date,
        required: true,
    },
});

export default mongoose.model('Notification', notificationSchema);
