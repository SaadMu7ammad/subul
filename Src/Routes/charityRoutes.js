import express, { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { registerCharity,authCharity,activateCharityAccount ,requestResetPassword} from '../Controllers/charityController.js';
const router = express.Router();

router.post('/',registerCharity);
router.post('/auth',authCharity);
router.post('/activate',auth,activateCharityAccount);
router.post('/reset',auth,requestResetPassword);

export default router;