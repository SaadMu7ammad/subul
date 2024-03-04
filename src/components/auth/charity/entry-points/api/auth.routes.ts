import { Router, Application, NextFunction, Request, Response } from 'express';
import logger from '../../../../../utils/logger';

import { validate } from '../../../../../libraries/validation/index';
import {
  resizeImg,
  imageAssertion,
} from '../../../../../libraries/uploads/components/images/handlers';
import {
  registerCharityValidation,
  loginCharityValidation,
} from '../../../../../libraries/validation/components/charity/charityAuthValidation';
import { authUseCase } from '../../domain/auth.use-case';
import { deleteOldImgs } from '../../../../../utils/deleteFile';
import { AuthedRequest } from '../../../user/data-access/auth.interface';

export default function defineRoutes(expressApp: Application) {
  const router = Router();

  router.post(
    '/register',
    imageAssertion,
    registerCharityValidation,
    validate,
    resizeImg,
    async (_req: Request, res: Response, next: NextFunction) => {
      const req = _req as AuthedRequest;
      try {
        logger.info(`Auth API was called to Register charity`);
        const registerCharityResponse = await authUseCase.registerCharity(
          req,
          res,
          next
        );
        return res.json(registerCharityResponse);
      } catch (error) {
        deleteOldImgs('charityLogos', req.body.image);
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/auth',
    loginCharityValidation,
    validate,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const req = _req as AuthedRequest;

        logger.info(`Auth API was called to Auth charity`);
        const authCharityResponse = await authUseCase.authCharity(
          req,
          res,
          next
        );
        return res.json(authCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/charities', router);
}
