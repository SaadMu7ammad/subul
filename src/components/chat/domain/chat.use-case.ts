import { NextFunction, Request, Response } from 'express';
import { chatService } from './chat.service';
import { BadRequestError } from '../../../libraries/errors/components';

// @desc   send message
// @route  POST /api/chat/send-message
// @access private
const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (res.locals.charity && !res.locals.charity.isConfirmed)
  throw new BadRequestError('Charity Account is not Completed to start chatting');


  let typeSender;
  if (res.locals.charity) {
    typeSender = 'charity'
  } else {
    typeSender = 'user'

  }

  const { receiverId, message } = req.body;

  const responseData = await chatService.sendMessage(typeSender, message, typeSender === 'user' ? res.locals.user._id.toString() : res.locals.charity._id.toString(), receiverId);

  return {
    message: responseData.message,
  };
};


export const chatUseCase = {
  sendMessage
};
