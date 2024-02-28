import { RequestHandler,Router,Application } from 'express';
import logger from '../../../../../utils/logger.js';

import { validate } from '../../../../../libraries/validation/index.js';
import {
  resizeImg,
  imageAssertion,
} from '../../../../../libraries/uploads/components/images/handlers.js';
import {
  registerCharityValidation,
  loginCharityValidation,
} from '../../../../../libraries/validation/components/charity/charityAuthValidation.js';
import { authUseCase } from '../../domain/auth.use-case.js';
import { deleteOldImgs } from '../../../../../utils/deleteFile.js';

export default function defineRoutes(expressApp:Application) {
  const router = Router();

  router.post(
    '/register',
    imageAssertion,
    registerCharityValidation,
    validate,
    resizeImg,
    async (req, res, next) => {
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
    async (req, res, next) => {
      try {
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
