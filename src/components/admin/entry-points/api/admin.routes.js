import express from 'express';

import { adminUseCase } from '../../domain/admin.use-case.js';
import { auth } from '../../../auth/shared/index.js';
import { isAdmin } from '../../index.js';
import logger from '../../../../utils/logger.js';

export default function defineRoutes(expressApp) {
  const router = express.Router();

  router.get('/AllRequestsCharities', auth, isAdmin, async (req, res, next) => {
    try {
      logger.info(`Admin API was called to get All Pending Requests Charities`);
      const getAllPendingRequestsCharitiesResponse =
        await adminUseCase.getAllPendingRequestsCharities(req, res, next);
      return res.json(getAllPendingRequestsCharitiesResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  router.get('/requestCharity/:id', auth, isAdmin, async (req, res, next) => {
    try {
      logger.info(
        `Admin API was called to get a Pending Request for Charity by Id`
      );
      const getAllPendingRequestsCharitiesResponse =
        await adminUseCase.getPendingRequestCharityById(req, res, next);
      return res.json(getAllPendingRequestsCharitiesResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  router.get(
    '/confirmedCharity/requestsPaymentMethods/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(
          `Admin API was called to get Pending Requests payment account`
        );
        const getCharityPaymentsRequestsByIdResponse =
          await adminUseCase.getPendingPaymentRequestsForConfirmedCharityById(req, res, next);
        return res.json(getCharityPaymentsRequestsByIdResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.get(
    '/confirmedCharities/AllRequestsPaymentMethods',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(
          `Admin API was called to get all Pending Requests payment account`
        );
        const allRequestsPaymentMethodsResponse =
          await adminUseCase.getAllRequestsPaymentMethodsForConfirmedCharities(req, res, next);
        return res.json(allRequestsPaymentMethodsResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.put(
    '/confirmrequestsCharities/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(`Admin API was called to get confirm a charity`);
        const confirmCharityResponse = await adminUseCase.confirmCharity(
          req,
          res,
          next
        );
        return res.json(confirmCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.put(
    '/rejectrequestsCharities/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(`Admin API was called to get reject a charity`);
        const rejectCharityResponse = await adminUseCase.rejectCharity(
          req,
          res,
          next
        );
        return res.json(rejectCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.put(
    '/confirmedCharity/confirmrequestPaymentMethod/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(
          `Admin API was called to get confirm a payment account for charity`
        );
        const confirmPaymentAccountResponse =
          await adminUseCase.confirmPaymentAccountRequestForConfirmedCharities(req, res, next);
        return res.json(confirmPaymentAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.put(
    '/confirmedCharity/rejectrequestPaymentMethod/:id',
    auth,
    isAdmin,
    async (req, res, next) => {
      try {
        logger.info(
          `Admin API was called to get reject a payment account for charity`
        );
        const rejectPaymentAccountResponse =
          await adminUseCase.rejectPaymentAccountRequestForConfirmedCharities(req, res, next);
        return res.json(rejectPaymentAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/admin', router);
}
