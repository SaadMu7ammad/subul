import { chatRepository } from '@components/chat/data-access/chat.repository';
import { IConversation, IMessage } from '@components/chat/data-access/interfaces';

const createConversationOrGetTheExist = async (senderId: string, receiverId: string) => {
  const _chatRepository = new chatRepository();

  //create a conversation if it not exist
  const conversation = await _chatRepository.createConversationOrGetTheExist(senderId, receiverId);
  return conversation;
};

const createMessage = async (senderId: string, receiverId: string, message: string) => {
  const _chatRepository = new chatRepository();

  const createdMessage = await _chatRepository.createMessage(senderId, receiverId, message);

  return createdMessage;
};

const addMsgIDInMsgsArrayOfConversation = async (
  conversation: IConversation,
  createdMessage: IMessage
) => {
  //store message id in the messages array of the conversation
  conversation.messages.push(createdMessage._id);
  await conversation.save();
};

const getConversation = async (receiverId: string, senderId: string) => {
  const _chatRepository = new chatRepository();

  const conversation = await _chatRepository.getConversation(receiverId, senderId);

  return conversation;
};

export const chatUtils = {
  createConversationOrGetTheExist,
  createMessage,
  addMsgIDInMsgsArrayOfConversation,
  getConversation,
};
