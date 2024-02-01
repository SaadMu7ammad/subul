import express, { Router } from 'express';

import { validate } from '../../../../libraries/validation/index.js';

import {
  resizeImg,
  imageAssertion,
} from '../../../../libraries/uploads/components/images/handlers.js';
import {
  registerCharityValidation,
  loginCharityValidation,
} from '../../../../libraries/validation/components/charity/charityAuthValidation.js';
import { auth, isConfirmed, isActivated } from '../../../auth/shared/index.js';
import { charityUseCase } from '../../domain/charity.use-case.js';
import logger from '../../../../utils/logger.js';

const router = express.Router();

router.post(
  '/register',
  imageAssertion,
  registerCharityValidation,
  validate,
  resizeImg,
  async (req, res, next) => {
    try {
      logger.info(`Register API was called to charity`);
      const registerCharityResponse = await charityUseCase.registerCharity(
        req,
        res,
        next
      );
      return res.json(registerCharityResponse);
    } catch (error) {
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
      logger.info(`auth API was called to charity`);
      const authCharityResponse = await charityUseCase.authCharity(
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

// router.post(
//   '/activate',
//   tokenCharityValidation,
//   validate,
//   auth,
//   activateCharityAccount
// );
// router.post(
//   '/reset',
//   requestResetEmailCharityValidation,
//   validate,
//   requestResetPassword
// );

// router.post(
//   '/reset/confirm',
//   confirmResetCharityValidation,
//   validate,
//   confirmResetPasswordRequest
// );
// router.post(
//   '/change-password',
//   changePasswordCharityValidation,
//   validate,
//   auth,
//   isActivated,
//   changePassword
// );
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

// router.put(
//   '/edit-profile',
//   auth,
//   isActivated,
//   isConfirmed,
//   updateuploadCoverImage,
//   resizeImgUpdated,
//   editCharityProfileValidation,
//   validate,
//   editCharityProfile
// );
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

export default router;
