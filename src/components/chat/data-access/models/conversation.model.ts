import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],
  },
  { timestamps: true }
);
declare module '../interfaces/chat.interface' {
  export type IConversation = HydratedDocument<
    InferSchemaType<typeof conversationSchema>
  >;

  export type PlainIConversation = InferSchemaType<typeof conversationSchema>;
}

const conversationModel = mongoose.model('Conversation', conversationSchema);

export default conversationModel;
