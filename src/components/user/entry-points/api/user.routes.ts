import express, { Application, NextFunction, Request, Response } from 'express';
import { userUseCase } from '../../domain/user.use-case';
import { validate } from '../../../../libraries/validation/index';
import { auth, isActivated } from '../../../auth/shared/index';
import { editUserProfileValidation } from '../../../../libraries/validation/components/user/editUserProfileValidation';
import {
  changePasswordUserValidation,
  confirmResetUserValidation,
  requestResetEmailUserValidation,
  tokenUserValidation,
} from '../../../../libraries/validation/components/user/allUserValidation';
import { getAllTransactions } from '../../../transaction/domain/transaction.use-case';
import logger from '../../../../utils/logger';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.post(
    '/logout',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to logout User`);
        const logOutResponse = userUseCase.logoutUser(res);
        return res.json(logOutResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  //notice reset and /reset/confirm without isActivated coz the if the user didn't activate his account and want to reset the pass
  router.post(
    '/reset',
    requestResetEmailUserValidation,
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
    confirmResetUserValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to confirm Reset`);
        const confirmResetResponse = await userUseCase.confirmReset(
          req,
          res,
          next
        );
        return res.json(confirmResetResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.put(
    '/changepassword',
    changePasswordUserValidation,
    validate,
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to change Password`);
        const changePasswordResponse = await userUseCase.changePassword(
          req,
          res,
          next
        );
        return res.json(changePasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/activate',
    tokenUserValidation,
    validate,
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to activate user Account`);
        const activateAccountResponse = await userUseCase.activateAccount(
          req,
          res,
          next
        );
        return res.json(activateAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/profile',
    auth,
    (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to get user profile`);
        const getUserProfileDataResponse = userUseCase.getUserProfileData(
          req,
          res,
          next
        );
        return res.json(getUserProfileDataResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.put(
    '/profile/edit',
    editUserProfileValidation,
    validate,
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`User API was called to edit user profile`);
        const editUserProfileResponse = await userUseCase.editUserProfile(
          req,
          res,
          next
        );
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
        const getAllTransactionsResponse = await getAllTransactions(
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
