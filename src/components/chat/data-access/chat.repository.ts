import { BadRequestError } from '../../../libraries/errors/components';
import { IConversation, chatDao } from './interfaces';
import conversationModel from './models/conversation.model';
import messageModel from './models/message.model';

export class chatRepository implements chatDao {
  async createConversationOrGetTheExist(
    senderId: string,
    receiverId: string
  ): Promise<IConversation> {
    let conversation: IConversation | null = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation)
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });

    return conversation;
  }
  async createMessage(senderId: string, receiverId: string, message: string) {
    const createdMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });

    if (!createdMessage)
      throw new BadRequestError('error happened while sending the message,try again');

    return createdMessage;
  }

  async getConversation(receiverId: string, senderId: string): Promise<IConversation> {
    const conversation: IConversation | null = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) throw new BadRequestError('conversation not found');

    return conversation.populate('messages');
  }
}
