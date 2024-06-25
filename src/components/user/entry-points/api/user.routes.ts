import { auth, isActivated } from '@components/auth/shared/index';
import { tranactionUseCaseClass } from '@components/transaction/domain/transaction.use-case';
import { userUseCase } from '@components/user/domain/user.use-case';
import {
  changePasswordUserValidation,
  confirmResetUserValidation,
  requestResetEmailUserValidation,
  tokenUserValidation,
} from '@libs/validation/components/user/allUserValidation';
import { editUserProfileValidation } from '@libs/validation/components/user/editUserProfileValidation';
import { validate } from '@libs/validation/index';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();
  const transactionUseCaseInstance = new tranactionUseCaseClass();
  router.post('/logout', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`User API was called to logout User`);
      const logOutResponse = userUseCase.logoutUser(res);
      return res.json(logOutResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  //notice reset and /reset/confirm without isActivated coz the if the user didn't activate his account and want to reset the pass
  router.post(
    '/reset',
    (req: Request, res: Response, next: NextFunction) => {
      const validation = requestResetEmailUserValidation(req);
      validation
        .run(req)
        .then(() => next())
        .catch(next);
    },
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to reset User`);
        const resetResponse = await userUseCase.resetUser(req);
        return res.json(resetResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/reset/confirm',
    (req: Request, res: Response, next: NextFunction) => {
      const validation = confirmResetUserValidation(req);
      Promise.all(validation.map(v => v.run(req)))
        .then(() => next())
        .catch(next);
    },
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to confirm Reset`);
        const confirmResetResponse = await userUseCase.confirmReset(req, res, next);
        return res.json(confirmResetResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.put(
    '/changepassword',
    (req: Request, res: Response, next: NextFunction) => {
      const validation = changePasswordUserValidation(req);
      validation
        .run(req)
        .then(() => next())
        .catch(next);
    },
    validate,
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to change Password`);
        const changePasswordResponse = await userUseCase.changePassword(req, res, next);
        return res.json(changePasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/activate',
    (req: Request, res: Response, next: NextFunction) => {
      const validation = tokenUserValidation(req);
      validation
        .run(req)
        .then(() => next())
        .catch(next);
    },
    validate,
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to activate user Account`);
        const activateAccountResponse = await userUseCase.activateAccount(req, res);
        return res.json(activateAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.get(
    '/bloodContribution/:id',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to blood Contribution `);
        const bloodContributionResponse = await userUseCase.bloodContribution(req, res, next);
        return res.json(bloodContributionResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/requestFundraisingCampaign',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to request Fundraising Campaign`);
        const requestFundraisingCampaignResponse = await userUseCase.requestFundraisingCampaign(
          req,
          res,
          next
        );
        return res.json(requestFundraisingCampaignResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.get('/profile', auth, (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`User API was called to get user profile`);
      const getUserProfileDataResponse = userUseCase.getUserProfileData(req, res, next);
      return res.json(getUserProfileDataResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  router.put(
    '/profile/edit',
    (req: Request, res: Response, next: NextFunction) => {
      const validation = editUserProfileValidation(req);
      Promise.all(validation.map(v => v.run(req)))
        .then(() => next())
        .catch(next);
    },
    validate,
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to edit user profile`);
        const editUserProfileResponse = await userUseCase.editUserProfile(req, res, next);
        return res.json(editUserProfileResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/myTransactions',
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to get user transactions`);
        const getAllTransactionsResponse = await transactionUseCaseInstance.getAllTransactions(
          req,
          res,
          next
        );
        return res.json(getAllTransactionsResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/users', router);
}
