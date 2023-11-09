import express, { Router } from 'express';

import { auth } from '../middlewares/authMiddleware.js';
import logger from '../utils/logger.js';
import { validate } from '../middlewares/validatorMiddleware.js';

import {
  registerCharity,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  confirmResetPasswordRequest,
  changePassword,
  logout,
  sendDocs,
  showCharityProfile,
  editCharityProfile,
  requestEditCharityProfilePayments,
  addCharityPayments,
} from '../Controllers/charityController.js';

import { resizeImg, resizeImgUpdated, updateuploadCoverImage, uploadCoverImage } from '../middlewares/imageMiddleware.js';
import { registerCharityValidation, loginCharityValidation } from '../utils/validatorComponents/charity/charityAuthValidation.js'
import {
  isConfirmed,
  isActivated,
} from '../middlewares/authStage2Middleware.js';

import {editCharityProfileValidation,reqEditPaymentMethodsValidation} from '../utils/validatorComponents/charity/editCharityProfileValidation.js';
import { resizeDoc, uploadDocs } from '../middlewares/docsMiddleware.js';
import {
  resizeDocReq,
  uploadDocsReq,
} from '../middlewares/reqDocPaymentMiddleware.js';
import { changePasswordCharityValidation, confirmResetCharityValidation, requestResetEmailCharityValidation, tokenCharityValidation } from '../utils/validatorComponents/charity/allCharityValidation.js';
const router = express.Router();

router.post(
  '/',
  uploadCoverImage,
  registerCharityValidation,
  validate,
  resizeImg,
  registerCharity
);
router.post('/auth', loginCharityValidation, validate, authCharity);

router.post(
  '/activate',
  tokenCharityValidation,
  validate,
  auth,
  activateCharityAccount
);
router.post('/reset', requestResetEmailCharityValidation, validate, requestResetPassword);

router.post(
  '/reset/confirm',
  confirmResetCharityValidation,
  validate,
  confirmResetPasswordRequest
);
router.post(
  '/change-password',
  changePasswordCharityValidation,
  validate,
  auth,
  isActivated,
  changePassword
);
// const upload = multer({ dest: 'uploads/docsCharities/' });
router.post('/logout', logout);
router.get('/profile', auth, showCharityProfile);
router.put(
  '/edit-profile',
  auth,
  isActivated,
  isConfirmed,
  updateuploadCoverImage,
  resizeImgUpdated,
  editCharityProfileValidation,
  validate,
  editCharityProfile
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
  requestEditCharityProfilePayments
);
router.post(
  '/send-docs',
  auth,
  uploadDocs,
  reqEditPaymentMethodsValidation,
  validate,
  resizeDoc,
  sendDocs,
  // , upload.single('charityDocs[docs1]'),
  // (req, res, next) => {
  //   console.log('req.file=');
  //   console.log(req.files);
  //   next();
  // },
  addCharityPayments
);

export default router;
