import { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../../../libraries/errors/components';
import { chatService } from './chat.service';

// @desc   send message
// @route  POST /api/chat/send-message
// @access private
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  let typeSender;
  if (res.locals.charity) {
    typeSender = 'charity';
  } else {
    typeSender = 'user';
  }

  const { receiverId, message }: { receiverId: string; message: string } = req.body;

  const responseData = await chatService.sendMessage(
    typeSender,
    message,
    typeSender === 'user' ? res.locals.user._id.toString() : res.locals.charity._id.toString(),
    receiverId,
    typeSender === 'charity' ? res.locals.charity : undefined
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
