import { ICharity } from '@components/charity/data-access/interfaces';
import { charityUtilsClass } from '@components/charity/domain/charity.utils';
import {
  PlainIConversation,
  chatServiceSkeleton,
  sendMessageResponse,
} from '@components/chat/data-access/interfaces';
import { userUtilsClass } from '@components/user/domain/user.utils';
import { BadRequestError } from '@libs/errors/components';

import { chatiUtilsClass } from './chat.utils';

export class chatServiceClass implements chatServiceSkeleton {
  charityUtilsInstance: charityUtilsClass;
  chatiUtilsInstance: chatiUtilsClass;
  constructor() {
    this.charityUtilsInstance = new charityUtilsClass();
    this.chatiUtilsInstance = new chatiUtilsClass();
  }
  async sendMessage(
    typeSender: string,
    message: string,
    senderId: string,
    receiverId: string,
    charity: ICharity | undefined
  ): Promise<sendMessageResponse> {
    const userUtilsInstance = new userUtilsClass();
    if (charity && !charity.isConfirmed)
      throw new BadRequestError('Charity Account is not Completed to start chatting');

    //check the reciever id is exist
    if (typeSender === 'user') await this.charityUtilsInstance.checkCharityIsExistById(receiverId);
    else await userUtilsInstance.checkUserIsExistById(receiverId);

    const conversation = await this.chatiUtilsInstance.createConversationOrGetTheExist(
      senderId,
      receiverId
    );
    const createdMessage = await this.chatiUtilsInstance.createMessage(
      senderId,
      receiverId,
      message
    );

    //store message id in the messages array of the conversation
    await this.chatiUtilsInstance.addMsgIDInMsgsArrayOfConversation(conversation, createdMessage);

    return { message: createdMessage };
  }

  async getConversation(receiverId: string, senderId: string): Promise<PlainIConversation> {
    const conversation = await this.chatiUtilsInstance.getConversation(receiverId, senderId);

    return conversation;
  }
}
// export const chatService = {
//   sendMessage,
//   getConversation,
// };
