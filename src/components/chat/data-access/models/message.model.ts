import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const messageSchema = new Schema(

  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

declare module '../interfaces/chat.interface' {
  export type IMessage = HydratedDocument<InferSchemaType<typeof messageSchema>>;
}


const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
