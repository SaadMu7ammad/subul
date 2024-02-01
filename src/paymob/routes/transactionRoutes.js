import express, { Router } from 'express';

import { hmacSetting } from '../hmac/hmac.controller.js';
import {
  preCreateTransaction,
  updateCaseInfo,
} from '../../controllers/transaction.controller.js';
import { auth, isActivated } from '../../components/auth/shared/index.js';
import { payWithOnlineCard } from '../onlineCards/onlineCards.controller.js';
import { paywithMobileWallet } from '../mobileWallets/mobileWallets.controller.js';
import { isAdmin } from '../../components/auth/admin/index.js';
import { getTransactionById } from '../admin/getTransactionById.controller.js';
import { refund } from '../refund/refund.controller.js';

const router = express.Router();

//for user
router.post(
  '/addTransaction/paymob/onlinecard',
  auth,
  isActivated,
  preCreateTransaction,
  payWithOnlineCard
);
router.post(
  '/addTransaction/paymob/mobilewallet',
  auth,
  isActivated,
  preCreateTransaction,
  paywithMobileWallet
);

//callbacks
//done first
// //Transaction processed callback
router.post('/paymob/callback', hmacSetting, updateCaseInfo);
//then
//Transaction response callback
router.get('/paymob/callback', (req, res, next) => {
  console.log('get cb');
  res.send(req.query);
  // res.send(req.query['data.message']);
});

//admin routes
router.get(
  '/admin/paymob/getTransactionById/:id',
  auth,
  isAdmin,
  getTransactionById
);
router.post('/admin/paymob/refund/:id', auth, isAdmin, refund); // auth then isAdmin then router.post('/paymob/callback', hmacSetting, updateCaseInfo); then refund

export default router;
