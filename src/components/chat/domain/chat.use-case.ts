import { BadRequestError } from '@libs/errors/components';
import { NextFunction, Request, Response } from 'express';

import { SenderType } from '../data-access/interfaces';
import { chatService } from './chat.service';

// @desc   send message
// @route  POST /api/chat/send-message
// @access private
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  let senderType: SenderType;
  if (res.locals.charity) {
    senderType = 'charity';
  } else {
    senderType = 'user';
  }

  const { receiverId, message }: { receiverId: string; message: string } = req.body;

  const responseData = await chatService.sendMessage(
    senderType,
    message,
    senderType === 'user' ? res.locals.user._id.toString() : res.locals.charity._id.toString(),
    receiverId,
    senderType === 'charity' ? res.locals.charity : undefined
  );

  return {
    message: responseData.message,
  };
};

// @desc   get conversation
// @route  GET /api/chat/get-conversation/:id
// @access private
const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  const { id: receiverId } = req.params;

  if (!receiverId) throw new BadRequestError(`Receiver-Id Not Found`);

  const { user, charity } = res.locals;

  const senderId: string = user ? user._id.toString() : charity._id.toString();

  const responseData = await chatService.getConversation(receiverId, senderId);

  return { conversation: responseData };
};

export const chatUseCase = {
  sendMessage,
  getConversation,
};
