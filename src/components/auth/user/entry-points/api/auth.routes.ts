import express, { Request, Response, NextFunction, Application } from 'express';
import logger from '../../../../../utils/logger';
import { authUseCase } from '../../domain/auth.use-case';
import {
  loginUserValidation,
  registerUserValidation,
} from '../../../../../libraries/validation/components/user/userAuthValidation';
import { validate } from '../../../../../libraries/validation/index';
// import { IUser } from '../../../../user/data-access/interfaces/user.interface.js';
// import { AuthedRequest } from '../../data-access/auth.interface.js';
import { IAuthUserResponse } from '../../data-access/auth.interface';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/',
    registerUserValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to register User`);
        // const authResponse = await authUseCase.registerUser(req, res, next);
        const response = await authUseCase.registerUser(req, res, next);
        const authResponse: IAuthUserResponse = response.user; // Extract user property as authResponse expects instead of { user }
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
