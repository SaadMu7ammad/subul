import { isAdmin } from '@components/admin/index';
import { auth, isActivated } from '@components/auth/shared/index';
import {
  preCreateTransaction,
  updateCaseInfo,
} from '@components/transaction/domain/transaction.use-case';
import { getTransactionById } from '@libs/paymob/admin/getTransactionById.controller';
import { hmacSetting } from '@libs/paymob/hmac/hmac.controller';
import { paywithMobileWallet } from '@libs/paymob/payment/mobileWallets/mobileWallets.controller';
import { payWithOnlineCard } from '@libs/paymob/payment/onlineCards/onlineCards.controller';
import { refund } from '@libs/paymob/refund/refund.controller';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

// import { AuthedRequest } from '../../../auth/user/data-access/auth.interface';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  //for user
  router.post(
    '/addTransaction/paymob/onlinecard',
    auth,
    isActivated,
    preCreateTransaction,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const req=_req as AuthedRequest
        logger.info(`transaction API was called to pay With OnlineCard`);
        const payWithOnlineCardResponse = await payWithOnlineCard(req, res, next);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const req=_req as AuthedRequest
        logger.info(`transaction API was called to pay With MobileWallet`);
        const payWithMobileWalletResponse = await paywithMobileWallet(req, res, next);
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
      logger.info('transaction created & case updated');
      return res.json(updateCaseInfoResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  //then
  //Transaction response callback
  router.get('/paymob/callback', (req, res, next) => {
    try {
      logger.info(`transaction API was called to finish the callback`);
      console.log('get cb');
      res.send(req.query);
    } catch (error) {
      next(error);
      return undefined;
    }

    // res.send(req.query['data.message']);
  });

  //admin routes
  router.get(
    '/admin/paymob/getTransactionById/:id',
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const req=_req as AuthedRequest

        logger.info(`transaction API was called to getTransactionById`);
        const getTransactionByIdResponse = await getTransactionById(req, res, next);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const req=_req as AuthedRequest
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
