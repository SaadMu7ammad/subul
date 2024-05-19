import { BadRequestError } from '../../../libraries/errors/components';
import { ICharity } from '../../charity/data-access/interfaces';
import { charityUtils } from '../../charity/domain/charity.utils';
import { userUtils } from '../../user/domain/user.utils';
import { PlainIConversation, sendMessageResponse } from '../data-access/interfaces';
import { chatUtils } from './chat.utils';

const sendMessage = async (
  typeSender: string,
  message: string,
  senderId: string,
  receiverId: string,
  charity: ICharity | undefined
): Promise<sendMessageResponse> => {
  if (charity && !charity.isConfirmed)
    throw new BadRequestError('Charity Account is not Completed to start chatting');

  //check the reciever id is exist
  if (typeSender === 'user') await charityUtils.checkCharityIsExistById(receiverId);
  else await userUtils.checkUserIsExistById(receiverId);

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
