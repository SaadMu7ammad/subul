import { chatRepository } from '@components/chat/data-access/chat.repository';
import { IConversation, IMessage, chatUtilSkeleton } from '@components/chat/data-access/interfaces';

export class chatiUtilsClass implements chatUtilSkeleton {
  async createConversationOrGetTheExist(
    senderId: string,
    receiverId: string
  ): Promise<IConversation> {
    const _chatRepository = new chatRepository();

    //create a conversation if it not exist
    const conversation = await _chatRepository.createConversationOrGetTheExist(
      senderId,
      receiverId
    );
    return conversation;
  }

  async createMessage(senderId: string, receiverId: string, message: string): Promise<IMessage> {
    const _chatRepository = new chatRepository();

    const createdMessage = await _chatRepository.createMessage(senderId, receiverId, message);

    return createdMessage;
  }

  async addMsgIDInMsgsArrayOfConversation(
    conversation: IConversation,
    createdMessage: IMessage
  ): Promise<void> {
    //store message id in the messages array of the conversation
    conversation.messages.push(createdMessage._id);
    await conversation.save();
  }

  async getConversation(receiverId: string, senderId: string): Promise<IConversation> {
    const _chatRepository = new chatRepository();

    const conversation = await _chatRepository.getConversation(receiverId, senderId);

    return conversation;
  }
}
// export const chatUtils = {
//   createConversationOrGetTheExist,
//   createMessage,
//   addMsgIDInMsgsArrayOfConversation,
//   getConversation,
// };
