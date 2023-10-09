import express, { Router } from 'express';
import multer from 'multer';

import { auth } from '../middlewares/authMiddleware.js';
import {
  registerCharity,
  uploadCoverImage,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  resizeImg,
} from '../Controllers/charityController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/',
  // upload.single('image'),
  // (req, res, next) => {
  //   req.file.path=req.file.path.replace("\\" ,"/")
  //   console.log(req.file);
  //   next();
  // },
  uploadCoverImage,resizeImg,
  registerCharity
);
router.post('/auth', authCharity);
router.post('/activate', auth, activateCharityAccount);
router.post('/reset', auth, requestResetPassword);

export default router;
