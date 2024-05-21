import { authUseCase } from '@components/auth/user/domain/auth.use-case';
import {
  loginUserValidation,
  registerUserValidation,
} from '@libs/validation/components/user/userAuthValidation';
import { validate } from '@libs/validation/index';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/',
    registerUserValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to register User`);
        const authResponse = await authUseCase.registerUser(req, res, next);
        return res.json(authResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/auth',
    loginUserValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to auth User`);
        const authResponse = await authUseCase.authUser(req, res, next);
        return res.json(authResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/users', router);
}
