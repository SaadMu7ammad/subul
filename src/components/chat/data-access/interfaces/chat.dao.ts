import { ICharity } from '@components/charity/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { IConversation, IMessage, PlainIConversation, sendMessageResponse } from '.';

export interface chatDao {
  createConversationOrGetTheExist(senderId: string, receiverId: string): Promise<IConversation>;
  createMessage(senderId: string, receiverId: string, content: string): Promise<IMessage>;
  getConversation(receiverId: string, senderId: string): Promise<IConversation>;
}

export interface chatUtilSkeleton {
  createConversationOrGetTheExist(senderId: string, receiverId: string): Promise<IConversation>;

  createMessage(senderId: string, receiverId: string, message: string): Promise<IMessage>;

  addMsgIDInMsgsArrayOfConversation(
    conversation: IConversation,
    createdMessage: IMessage
  ): Promise<void>;

  getConversation(receiverId: string, senderId: string): Promise<IConversation>;
}

export interface chatUseCaseSkeleton {
  sendMessage(req: Request, res: Response, next: NextFunction): Promise<{ message: IMessage }>;
  getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ conversation: PlainIConversation }>;
}

export interface chatServiceSkeleton {
  sendMessage(
    senderType: string,
    message: string,
    senderId: string,
    receiverId: string,
    charity: ICharity | undefined
  ): Promise<sendMessageResponse>;

  getConversation(receiverId: string, senderId: string): Promise<PlainIConversation>;
}
