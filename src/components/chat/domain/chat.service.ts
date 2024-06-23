import { ICharity } from '@components/charity/data-access/interfaces';
import { charityUtils } from '@components/charity/domain/charity.utils';
import { PlainIConversation, sendMessageResponse } from '@components/chat/data-access/interfaces';
import { userUtilsClass } from '@components/user/domain/user.utils';
import { BadRequestError } from '@libs/errors/components';

import { chatUtils } from './chat.utils';

const sendMessage = async (
  typeSender: string,
  message: string,
  senderId: string,
  receiverId: string,
  charity: ICharity | undefined
): Promise<sendMessageResponse> => {
  const userUtilsInstance = new userUtilsClass();
  if (charity && !charity.isConfirmed)
    throw new BadRequestError('Charity Account is not Completed to start chatting');

  //check the reciever id is exist
  if (typeSender === 'user') await charityUtils.checkCharityIsExistById(receiverId);
  else await userUtilsInstance.checkUserIsExistById(receiverId);

  const conversation = await chatUtils.createConversationOrGetTheExist(senderId, receiverId);
  const createdMessage = await chatUtils.createMessage(senderId, receiverId, message);

  //store message id in the messages array of the conversation
  await chatUtils.addMsgIDInMsgsArrayOfConversation(conversation, createdMessage);

  return { message: createdMessage };
};

const getConversation = async (
  receiverId: string,
  senderId: string
): Promise<PlainIConversation> => {
  const conversation = await chatUtils.getConversation(receiverId, senderId);

  return conversation;
};

export const chatService = {
  sendMessage,
  getConversation,
};
