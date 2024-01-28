import express, { Router } from 'express';

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  resetUser,
  confirmReset,
  changePassword,
  activateAccount,
  editUserProfile,
  getUserProfileData,
} from '../domain/user.use-case.js';

import { validate } from '../../../middlewares/validatorMiddleware.js';
import { auth } from '../../../middlewares/authMiddleware.js';
import { editUserProfileValidation } from '../../../utils/validatorComponents/user/editUserProfileValidation.js';
import {
  registerUserValidation,
  loginUserValidation,
} from '../../../utils/validatorComponents/user/userAuthValidation.js';
import {
  changePasswordUserValidation,
  confirmResetUserValidation,
  requestResetEmailUserValidation,
  tokenUserValidation,
} from '../../../utils/validatorComponents/user/allUserValidation.js';
import { isActivated } from '../../../middlewares/authStage2Middleware.js';
import { getAllTransactions } from '../../../controllers/transaction.controller.js';
import logger from '../../../utils/logger.js';

router.post('/', registerUserValidation, validate, async (req, res, next) => {
  try {
    logger.info(`register User`);
    const authResponse = await registerUser(req, res, next);
    return res.json(authResponse);
  } catch (error) {
    next(error);
    return undefined;
  }
});

// router.post('/auth', loginUserValidation, validate, authUser);
router.post('/auth', loginUserValidation, validate, async (req, res, next) => {
  try {
    logger.info(`auth User`);
    const authResponse = await authUser(req, res, next);
    return res.json(authResponse);
  } catch (error) {
    next(error);
    return undefined;
  }
});
router.post('/logout', (req, res, next) => {
  try {
    logger.info(`logout User`);
    const logOutResponse = logoutUser(req, res, next);
    return res.json(logOutResponse);
  } catch (error) {
    next(error);
    return undefined;
  }
});
//notice reset and /reset/confirm without isActivated coz the if the user didnt activate his account and want to reset the pass
router.post(
  '/reset',
  requestResetEmailUserValidation,
  validate,
  async (req, res, next) => {
    try {
      logger.info(`reset User`);
      const resetResponse = await resetUser(req, res, next);
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
  async (req, res, next) => {
    try {
      logger.info(`confirm Reset`);
      const confirmResetResponse = await confirmReset(req, res, next);
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
  async (req, res, next) => {
    try {
      logger.info(`change Password`);
      const changePasswordResponse = await changePassword(req, res, next);
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
  async (req, res, next) => {
    try {
      logger.info(`activate Account`);
      const activateAccountResponse = await activateAccount(req, res, next);
      return res.json(activateAccountResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  }
);
router.get('/profile', auth, (req, res, next) => {
  try {
    logger.info(`user auth`);
    const getUserProfileDataResponse = getUserProfileData(req, res, next);
    return res.json(getUserProfileDataResponse);
  } catch (error) {
    next(error);
    return undefined;
  }
});
router.put(
  '/profile/edit',
  editUserProfileValidation,
  validate,
  auth,
  isActivated,
  async (req, res, next) => {
    try {
      logger.info(`activate Account`);
      const editUserProfileResponse = await editUserProfile(req, res, next);
      return res.json(editUserProfileResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  }
);
router.get('/myTransactions', auth, isActivated, async (req, res, next) => {
  try {
    logger.info(`activate Account`);
    const getAllTransactionsResponse = await getAllTransactions(req, res, next);
    return res.json(getAllTransactionsResponse);
  } catch (error) {
    next(error);
    return undefined;
  }
});
export default router;
