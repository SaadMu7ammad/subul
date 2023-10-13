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
} from '../Controllers/charityController.js';
import { resizeImg, uploadCoverImage } from '../middlewares/imageMiddleware.js';
// import logger from '../utils/logger.js';
import changePasswordValidation from '../utils/validatorComponents/changePasswordValidation.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import {
  emailValidation,
  tokenValidation,
} from '../utils/validatorComponents/validatorComponents.js';
import loginValidation from '../utils/validatorComponents/loginValidation.js';
import confirmResetValidation from '../utils/validatorComponents/confirmResetValidation.js';
import { charityRegisterValidation } from '../utils/validatorComponents/charityRegisterValidation.js';
import multer from 'multer';
import { resizeDoc, uploadDocs } from '../middlewares/docsMiddleware.js';
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
const upload = multer({ dest: 'uploads/docsCharities/' });
router.post('/logout', logout);
router.post(
  '/send-docs',
  auth,
  uploadDocs,
  resizeDoc,
  // , upload.single('charityDocs[docs1]'),
  // (req, res, next) => {
  //   console.log('req.file=');
  //   console.log(req.files);
  //   next();
  // },

  sendDocs
);

export default router;
