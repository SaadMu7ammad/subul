import express, { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { registerCharity,authCharity,activateCharityAccount } from '../Controllers/charityController.js';
const router = express.Router();

router.post('/',registerCharity);
router.post('/auth',authCharity);
router.post('/activate',auth,activateCharityAccount);

export default router;