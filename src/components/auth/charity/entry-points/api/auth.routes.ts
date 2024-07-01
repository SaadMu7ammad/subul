import { authCharityUseCase } from '@components/auth/charity/domain/auth.use-case';
import { imageAssertion, resizeImg } from '@libs/uploads/components/images/handlers';
import {
  loginCharityValidation,
  registerCharityValidation,
} from '@libs/validation/components/charity/charityAuthValidation';
import { validate } from '@libs/validation/index';
import { deleteOldImgs } from '@utils/deleteFile';
import logger from '@utils/logger';
import { Application, NextFunction, Request, Response, Router } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = Router();
  const authCharityUseCaseInstance = new authCharityUseCase();
  router.post(
    '/register',
    imageAssertion,
    registerCharityValidation,
    validate,
    resizeImg,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to Register charity`);
        const registerCharityResponse = await authCharityUseCaseInstance.registerCharity(
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Auth API was called to Auth charity`);
        const authCharityResponse = await authCharityUseCaseInstance.authCharity(req, res, next);
        return res.json(authCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/charities', router);
}
