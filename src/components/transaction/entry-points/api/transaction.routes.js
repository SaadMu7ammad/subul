import express, { Router } from 'express';

import { auth, isActivated } from '../../../auth/shared/index.js';
import { isAdmin } from '../../../admin/index.js';
import {
  preCreateTransaction,
  updateCaseInfo,
} from '../../domain/transaction.use-case.js';

import { hmacSetting } from '../../../../libraries/paymob/hmac/hmac.controller.js';
import { payWithOnlineCard } from '../../../../libraries/paymob/onlineCards/onlineCards.controller.js';
import { paywithMobileWallet } from '../../../../libraries/paymob/mobileWallets/mobileWallets.controller.js';
import { getTransactionById } from '../../../../libraries/paymob/admin/getTransactionById.controller.js';
import { refund } from '../../../../libraries/paymob/refund/refund.controller.js';

export default function defineRoutes(expressApp) {
  const router = express.Router();

  //for user
  router.post(
    '/addTransaction/paymob/onlinecard',
    auth,
    isActivated,
    preCreateTransaction,
    async (req, res, next) => {
      try {
        logger.info(`transaction API was called to pay With OnlineCard`);
        const payWithOnlineCardResponse = await payWithOnlineCard(
          req,
          res,
          next
        );
        return res.json(payWithOnlineCardResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/addTransaction/paymob/mobilewallet',
    auth,
    isActivated,
    preCreateTransaction,
    async (req, res, next) => {
      try {
        logger.info(`transaction API was called to pay With MobileWallet`);
        const payWithMobileWalletResponse = await paywithMobileWallet(
          req,
          res,
          next
        );
        return res.json(payWithMobileWalletResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  //callbacks
  //done first
  // //Transaction processed callback
  router.post('/paymob/callback', hmacSetting, async (req, res, next) => {
    try {
      logger.info(`transaction API was called to update Case Info`);
      const updateCaseInfoResponse = await updateCaseInfo(req, res, next);
      return res.json(updateCaseInfoResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
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
    async (req, res, next) => {
      try {
        logger.info(`transaction API was called to getTransactionById`);
        const getTransactionByIdResponse = await getTransactionById(
          req,
          res,
          next
        );
        return res.json(getTransactionByIdResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  // auth then isAdmin then router.post('/paymob/callback', hmacSetting, updateCaseInfo); then refund
  router.post(
    '/admin/paymob/refund/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(`transaction API was called to refund`);
        const refundResponse = await refund(req, res, next);
        return res.json(refundResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/payment', router);
}
