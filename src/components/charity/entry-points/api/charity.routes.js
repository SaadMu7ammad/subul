import express from 'express';

import { auth, isConfirmed, isActivated } from '../../../auth/shared/index.js';
import { charityUseCase } from '../../domain/charity.use-case.js';
import logger from '../../../../utils/logger.js';
import {
  changePasswordCharityValidation,
  confirmResetCharityValidation,
  requestResetEmailCharityValidation,
  tokenCharityValidation,
} from '../../../../libraries/validation/components/charity/allCharityValidation.js';
import {
  editCharityProfileValidation,
  reqEditPaymentMethodsValidation,
} from '../../../../libraries/validation/components/charity/editCharityProfileValidation.js';
import { validate } from '../../../../libraries/validation/index.js';
import {
  imageAssertion,
  resizeImg,
} from '../../../../libraries/uploads/components/images/handlers.js';
import {
  resizeDoc,
  uploadDocs,
} from '../../../../libraries/uploads/components/docs/images/handler.js';
import { deleteCharityDocs,deleteOldImgs} from '../../../../utils/deleteFile.js';
import { uploadDocsReq,resizeDocReq } from '../../../../libraries/uploads/components/docs/images/handler2.js';

export default function defineRoutes(expressApp) {
  const router = express.Router();
  router.post(
    '/activate',
    tokenCharityValidation,
    validate,
    auth,
    async (req, res, next) => {
      try {
        logger.info(`Charity API was called to Activate Account`);
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
        logger.info(`Charity API was called to Reset Password`);
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
        logger.info(`Charity API was called to Confirm Reset Password`);
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
        logger.info(`Charity API was called to Change Password`);
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
  // // const upload = multer({ dest: 'uploads/charityDocs/' });
  router.post('/logout', (req, res, next) => {
    try {
      logger.info(`Charity API was called to logout`);
      const logoutResponse = charityUseCase.logout(req, res, next);
      return res.json(logoutResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  router.get('/profile', auth, (req, res, next) => {
    try {
      logger.info(`Charity API was called to Show Profile`);
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
  //should add edit image in a separate api
  router.put(
    '/edit-profile',
    auth,
    isActivated,
    isConfirmed,
    editCharityProfileValidation,
    validate,
    async (req, res, next) => {
      try {
        logger.info(`Charity API was called to Edit Profile`);
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
    router.put(
      '/edit-profileImg',
      auth,
      isActivated,
      isConfirmed,
      imageAssertion,
      resizeImg,
      async (req, res, next) => {
        try {
          logger.info(`Charity API was called to Edit Profile Img`);
          const changeProfileImageResponse =
            await charityUseCase.changeProfileImage(req, res, next);
          return res.json(changeProfileImageResponse);
        } catch (error) {
          next(error);
          return undefined;
        }
      }
    );

  router.post( 
    '/request-edit-payment',
    auth,
    isActivated,
    isConfirmed,
    uploadDocsReq,
    reqEditPaymentMethodsValidation,
    validate,
    resizeDocReq,
    async(req,res,next)=>{
      try{
        logger.info(`Charity API was called to Request Edit Payments`);
        const editCharityPaymentResponse = await charityUseCase.requestEditCharityPayments(req,res,next);
        return res.json(editCharityPaymentResponse);
      }catch(error){
        deleteCharityDocs(req,'payment');
        next(error);
        return undefined;
      }
    }
  );
  
  router.post(
    '/send-docs',
    auth,
    uploadDocs,
    reqEditPaymentMethodsValidation,
    validate,
    resizeDoc,
    async (req, res, next) => {
      try {
        logger.info(`Charity API was called to Send Docs`);
        const sendDocsResponse = await charityUseCase.sendDocs(req, res, next);
        return res.json(sendDocsResponse);
      } catch (error) {
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs2);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs1);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs3);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs4);
        deleteOldImgs(
          'charityDocs',
          req?.body?.paymentMethods?.bankAccount?.docsBank
        );
        deleteOldImgs(
          'charityDocs',
          req?.body?.paymentMethods?.fawry?.fawryDocs
        );
        deleteOldImgs(
          'charityDocs',
          req?.body?.paymentMethods?.vodafoneCash?.docsVodafoneCash
        );
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/charities', router);
}
