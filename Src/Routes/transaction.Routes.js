import express, { Router } from 'express';
import dotenv from 'dotenv/config';
import {
  CreateAuthenticationRequestOnlineCard,
  OrderRegistrationAPIOnlineCard,
  PaymentKeyRequestOnlineCard,
  payWithOnlineCard,
} from '../paymob/onlineCards/onlineCards.service.js';
import {
  CreateAuthenticationRequestMobileWallet,
  OrderRegistrationAPIMobileWallet,
  PaymentKeyRequestMobileWallet,
  paywithMobileWallet,
} from '../paymob/mobileWallets/mobileWallets.service.js';
const router = express.Router();

router.post('/onlinecard/auth', CreateAuthenticationRequestOnlineCard);
router.post('/onlinecard/preOrder', OrderRegistrationAPIOnlineCard);
router.post('/onlinecard/requestKey', PaymentKeyRequestOnlineCard);
router.post('/onlinecard/pay', payWithOnlineCard);

router.post('/mobilewallet/auth', CreateAuthenticationRequestMobileWallet);
router.post('/mobilewallet/preOrder', OrderRegistrationAPIMobileWallet);
router.post('/mobilewallet/requestKey', PaymentKeyRequestMobileWallet);
router.post('/mobilewallet/pay', paywithMobileWallet);
// router.post('/paywithMobileWallet', paywithMobileWallet);
export default router;
