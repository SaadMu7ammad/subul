import { IConversation, IMessage } from '.';

export interface chatDao {
  createConversationOrGetTheExist(
    senderId: string,
    receiverId: string
  ): Promise<IConversation>;
  createMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<IMessage>;
  getConversation(receiverId: string, senderId: string): Promise<IConversation>;
}
