import mongoose, { HydratedDocument, InferSchemaType, Schema } from 'mongoose';

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

const resourceSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['case', 'usedItem'],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'resource.type',
      required: true,
    },
  },
  { _id: false }
);

const notificationSchema = new Schema(
  {
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
    resource:{
      type: resourceSchema,
      required: false,
    },
    maxAge: {
      //Expiry Date in MS
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model('Notification', notificationSchema);

declare module '../interfaces/notification.interface' {
  export type PlainNotification = Omit<
    InferSchemaType<typeof notificationSchema>,
    'createdAt' | 'updatedAt'
  >;

  export type INotification = HydratedDocument<
    InferSchemaType<typeof notificationSchema>
  >;
}
export default NotificationModel;
