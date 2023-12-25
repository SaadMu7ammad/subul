import express, { Router } from 'express';

import { hmacSetting } from '../hmac/hmac.controller.js';
import { preCreateTransaction, updateCaseInfoOrRefund} from '../../Controllers/transaction.controller.js'
import { auth } from '../../middlewares/authMiddleware.js';
import { isActivated } from '../../middlewares/authStage2Middleware.js';
import { payWithOnlineCard } from '../onlineCards/onlineCards.controller.js';
import { paywithMobileWallet } from '../mobileWallets/mobileWallets.controller.js';
import { isAdmin } from '../../middlewares/isAdminMiddleware.js';
import { getTransactionById } from '../admin/getTransactionById.controller.js';
import { refund } from '../Refund/refund.controller.js';

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
router.post('/paymob/callback', hmacSetting, updateCaseInfoOrRefund);
//then
//Transaction response callback
router.get('/paymob/callback', (req, res, next) => {
  res.send(req.query);
  // res.send(req.query['data.message']);
});

//admin routes
router.get('/admin/paymob/getTransactionById/:id',auth,isAdmin,getTransactionById)
router.post('/admin/paymob/refund/:id', auth, isAdmin, refund)

export default router;
