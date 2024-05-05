import { charityUtils } from '../../charity/domain/charity.utils';
import { userUtils } from '../../user/domain/user.utils';
import { chatRepository } from '../data-access/chat.repository';
import {
  PlainIConversation,
  sendMessageResponse,
} from '../data-access/interfaces';

const _chatRepository = new chatRepository();

const sendMessage = async (
  typeSender: string,
  message: string,
  senderId: string,
  receiverId: string
): Promise<sendMessageResponse> => {
  //check the reciever id is exist
  if (typeSender === 'user')
    await charityUtils.checkCharityIsExistById(receiverId);
  else await userUtils.checkUserIsExistById(receiverId);

  //create a conversation if it not exist
  const conversation = await _chatRepository.createConversationOrGetTheExist(
    senderId,
    receiverId
  );

  const createdMessage = await _chatRepository.createMessage(
    senderId,
    receiverId,
    message
  );

  //store message id in the messages array of the conversation
  conversation.messages.push(createdMessage._id);

  await conversation.save();

  return { message: createdMessage };
};

const getConversation = async (
  receiverId: string,
  senderId: string
): Promise<PlainIConversation> => {
  const conversation = await _chatRepository.getCoversation(
    receiverId,
    senderId
  );

  return conversation;
};

export const chatService = {
  sendMessage,
  getConversation,
};
