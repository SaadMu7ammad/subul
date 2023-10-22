import express, { Router } from 'express';

import { auth } from '../middlewares/authMiddleware.js';

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
import { resizeImg, uploadCoverImage } from '../middlewares/imageMiddleware.js';
// import logger from '../utils/logger.js';
import changePasswordValidation from '../utils/validatorComponents/changePasswordValidation.js';
import confirmResetValidation from '../utils/validatorComponents/confirmResetValidation.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import loginValidation from '../utils/validatorComponents/loginValidation.js';
import { charityRegisterValidation } from '../utils/validatorComponents/charity/charityRegisterValidation.js';
import {
  tokenValidation,
  emailValidation,
  // paymentValidation,
} from '../utils/validatorComponents/charity/allCharityValidation.js';
import editProfileValidation from '../utils/validatorComponents/charity/editCharityProfileValidation.js';
import { resizeDoc, uploadDocs } from '../middlewares/docsMiddleware.js';
import {
  resizeDocReq,
  uploadDocsReq,
} from '../middlewares/reqDocPaymentMiddleware.js';
const router = express.Router();

router.post(
  '/',
  uploadCoverImage,
  resizeImg,
  charityRegisterValidation,
  validate,
  registerCharity
);
router.post('/auth', loginValidation, validate, authCharity);

router.post(
  '/activate',
  tokenValidation,
  validate,
  auth,
  activateCharityAccount
);
router.post('/reset', emailValidation, validate, requestResetPassword);

router.post(
  '/reset/confirm',
  confirmResetValidation,
  validate,
  confirmResetPasswordRequest
);
router.post(
  '/change-password',
  changePasswordValidation,
  validate,
  auth,
  changePassword
);
// const upload = multer({ dest: 'uploads/docsCharities/' });
router.post('/logout', logout);
router.get('/profile', auth, showCharityProfile);
router.put(
  '/edit-profile',
  uploadCoverImage,
  resizeImg,
  editProfileValidation,
  validate,
  auth,
  editCharityProfile
);
router.post(
  '/request-edit-payment',
  auth,
  uploadDocsReq,
  editProfileValidation,
  validate,
  resizeDocReq,
  requestEditCharityProfilePayments
);
router.post(
  '/send-docs',
  auth,
  // paymentValidation,
  // validate,
  uploadDocs,
  resizeDoc,
  // , upload.single('charityDocs[docs1]'),
  // (req, res, next) => {
  //   console.log('req.file=');
  //   console.log(req.files);
  //   next();
  // },
  sendDocs,
  addCharityPayments
);

export default router;
