import express, { Router } from 'express';

import { auth } from '../middlewares/authMiddleware.js';

import {
  registerCharity,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  confirmResetPasswordRequest,
  sendDocs,
} from '../Controllers/charityController.js';
import { resizeImg, uploadCoverImage } from '../middlewares/imageMiddleware.js';
// import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', uploadCoverImage, resizeImg, registerCharity);
router.post('/auth', authCharity);
router.post('/activate', auth, activateCharityAccount);
router.post('/reset', requestResetPassword);
router.post('/reset/confirm', confirmResetPasswordRequest);
router.post(
  '/send-docs',
  auth,
  (req, res, next) => {
    console.log(req.file);
    next();
  },
  sendDocs
);

export default router;
