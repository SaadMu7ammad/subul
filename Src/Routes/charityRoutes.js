import express, { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { registerCharity,authCharity,activateCharityAccount ,requestResetPassword} from '../Controllers/charityController.js';
import {
  registerCharity,
  uploadCoverImage,
} from '../Controllers/charityController.js';

const router = express.Router();

router.post('/', uploadCoverImage, registerCharity);
router.post('/auth',authCharity);
router.post('/activate',auth,activateCharityAccount);
router.post('/reset',auth,requestResetPassword);

export default router;
