import { BadRequestError } from '@libs/errors/components';
import { NextFunction, Request, Response } from 'express';

import {
  IMessage,
  PlainIConversation,
  SenderType,
  chatUseCaseSkeleton,
} from '../data-access/interfaces';
import { chatServiceClass } from './chat.service';

export class chatUseCaseClass implements chatUseCaseSkeleton {
  chatServiceInstance: chatServiceClass;
  constructor() {
    this.chatServiceInstance = new chatServiceClass();
  }
  // @desc   send message
  // @route  POST /api/chat/send-message
  // @access private
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ message: IMessage }> {
    let senderType: SenderType;
    if (res.locals.charity) {
      senderType = 'charity';
    } else {
      senderType = 'user';
    }

    const { receiverId, message }: { receiverId: string; message: string } = req.body;

    const responseData = await this.chatServiceInstance.sendMessage(
      senderType,
      message,
      senderType === 'user' ? res.locals.user._id.toString() : res.locals.charity._id.toString(),
      receiverId,
      senderType === 'charity' ? res.locals.charity : undefined
    );

    return {
      message: responseData.message,
    };
  }

  // @desc   get conversation
  // @route  GET /api/chat/get-conversation/:id
  // @access private
  async getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ conversation: PlainIConversation }> {
    const { id: receiverId } = req.params;

    if (!receiverId) throw new BadRequestError(`Receiver-Id Not Found`);

    const { user, charity } = res.locals;

    const senderId: string = user ? user._id.toString() : charity._id.toString();

    const responseData: PlainIConversation = await this.chatServiceInstance.getConversation(
      receiverId,
      senderId
    );

    return { conversation: responseData };
  }
}
// export const chatUseCase = {
//   sendMessage,
//   getConversation,
// };
