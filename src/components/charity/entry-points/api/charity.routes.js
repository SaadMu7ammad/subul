import express, { Router } from 'express';

import { auth, isConfirmed, isActivated } from '../../../auth/shared/index.js';
import { charityUseCase } from '../../domain/charity.use-case.js';
import logger from '../../../../utils/logger.js';
import {
  changePasswordCharityValidation,
  confirmResetCharityValidation,
  requestResetEmailCharityValidation,
  tokenCharityValidation,
} from '../../../../libraries/validation/components/charity/allCharityValidation.js';
import { editCharityProfileValidation } from '../../../../libraries/validation/components/charity/editCharityProfileValidation.js';
import { validate } from '../../../../libraries/validation/index.js';
import {
  imageAssertion,
  resizeImg,
} from '../../../../libraries/uploads/components/images/handlers.js';
export default function defineRoutes(expressApp) {
  const router = express.Router();
  router.post(
    '/activate',
    tokenCharityValidation,
    validate,
    auth,
    async (req, res, next) => {
      try {
        logger.info(`activate API was called to charity`);
        const activateCharityAccountResponse =
          await charityUseCase.activateCharityAccount(req, res, next);
        return res.json(activateCharityAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/reset',
    requestResetEmailCharityValidation,
    validate,
    async (req, res, next) => {
      try {
        logger.info(`reset API was called to charity`);
        const requestResetPasswordResponse =
          await charityUseCase.requestResetPassword(req, res, next);
        return res.json(requestResetPasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/reset/confirm',
    confirmResetCharityValidation,
    validate,
    async (req, res, next) => {
      try {
        logger.info(`reset API was called to charity`);
        const confirmResetPasswordResponse =
          await charityUseCase.confirmResetPassword(req, res, next);
        return res.json(confirmResetPasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/change-password',
    changePasswordCharityValidation,
    validate,
    auth,
    isActivated,
    async (req, res, next) => {
      try {
        logger.info(`change password API was called to charity`);
        const changePasswordResponse = await charityUseCase.changePassword(
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
  // // const upload = multer({ dest: 'uploads/docsCharities/' });
  router.post('/logout', (req, res, next) => {
    try {
      logger.info(`logout API was called to charity`);
      const logoutResponse = charityUseCase.logout(req, res, next);
      return res.json(logoutResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  router.get('/profile', auth, (req, res, next) => {
    try {
      logger.info(`showProfie API was called to charity`);
      const showCharityProfileResponse = charityUseCase.showCharityProfile(
        req,
        res,
        next
      );
      return res.json(showCharityProfileResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  //should add edit image in a seperate api
  router.put(
    '/edit-profile',
    auth,
    isActivated,
    isConfirmed,
    // updateuploadCoverImage,
    // resizeImgUpdated,
    editCharityProfileValidation,
    validate,
    async (req, res, next) => {
      try {
        logger.info(`edit-profile API was called to charity`);
        const changePasswordResponse = await charityUseCase.editCharityProfile(
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
  '/register',
    router.put(
      '/edit-profileImg',
      auth,
      isActivated,
      isConfirmed,
      imageAssertion,
      resizeImg,
      async (req, res, next) => {
        try {
          logger.info(`change password API was called to charity`);
          const changeProfileImageResponse =
            await charityUseCase.changeProfileImage(req, res, next);
          return res.json(changeProfileImageResponse);
        } catch (error) {
          next(error);
          return undefined;
        }
      }
    );
  // router.post(
  //   '/request-edit-payment',
  //   auth,
  //   isActivated,
  //   isConfirmed,
  //   uploadDocsReq,
  //   reqEditPaymentMethodsValidation,
  //   validate,
  //   resizeDocReq,
  //   requestEditCharityProfilePayments
  // );
  // router.post(
  //   '/send-docs',
  //   auth,
  //   uploadDocs,
  //   reqEditPaymentMethodsValidation,
  //   validate,
  //   resizeDoc,
  //   sendDocs,
  //   // , upload.single('charityDocs[docs1]'),
  //   // (req, res, next) => {
  //   //   console.log('req.file=');
  //   //   console.log(req.files);
  //   //   next();
  //   // },
  //   addCharityPayments
  // );

  expressApp.use('/api/charities', router);
}
