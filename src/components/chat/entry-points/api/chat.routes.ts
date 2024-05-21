import { auth, isActivated } from '@components/auth/shared';
import { chatUseCase } from '@components/chat/domain/chat.use-case';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  //notice reset and /reset/confirm without isActivated coz the if the user didn't activate his account and want to reset the pass
  router.post(
    '/send-message',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`send message in a conversation`);
        const sendMessageResponse = await chatUseCase.sendMessage(req, res, next);
        return res.json(sendMessageResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/get-conversation/:id',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`get conversation`);
        const getConversationResponse = await chatUseCase.getConversation(req, res, next);
        return res.json(getConversationResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/chats', router);
}
