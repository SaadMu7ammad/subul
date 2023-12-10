import express, { Router } from 'express';
import { payWithOnlineCard } from '../onlineCards/onlineCards.controller.js';
import { paywithMobileWallet } from '../mobileWallets/mobileWallets.controller.js';
const router = express.Router();
router.post('/onlinecard/pay', payWithOnlineCard);
router.post('/mobilewallet/pay', paywithMobileWallet);
export default router;
