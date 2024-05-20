import { Application, NextFunction, Request, Response, Router } from 'express';

import {
  imageAssertion,
  resizeImg,
} from '../../../../../libraries/uploads/components/images/handlers';
import {
  loginCharityValidation,
  registerCharityValidation,
} from '../../../../../libraries/validation/components/charity/charityAuthValidation';
import { validate } from '../../../../../libraries/validation/index';
import { deleteOldImgs } from '../../../../../utils/deleteFile';
import logger from '../../../../../utils/logger';
import { authUseCase } from '../../domain/auth.use-case';

export default function defineRoutes(expressApp: Application) {
  const router = Router();

  router.post(
    '/register',
    imageAssertion,
    registerCharityValidation,
    validate,
    resizeImg,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to Register charity`);
        const registerCharityResponse = await authUseCase.registerCharity(req, res, next);

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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to Auth charity`);
        const authCharityResponse = await authUseCase.authCharity(req, res, next);
        return res.json(authCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/charities', router);
}
