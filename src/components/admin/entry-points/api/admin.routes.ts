import { adminUseCaseClass } from '@components/admin/domain/admin.use-case';
import { isAdmin } from '@components/admin/index';
import { auth } from '@components/auth/shared/index';
import { ConfirmPendingCharity } from '@components/charity/data-access/interfaces';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();
  const adminUseCaseInstance = new adminUseCaseClass();
  router.get(
    '/AllCharities',
    auth,
    isAdmin,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get All Charities`);
        const allCharitiesResponse = await adminUseCaseInstance.getAllCharities();
        return res.json(allCharitiesResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/AllRequestsCharities',
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get All Pending Requests Charities`);
        const getAllPendingRequestsCharitiesResponse =
          await adminUseCaseInstance.getAllPendingRequestsCharities(req, res, next);
        return res.json(getAllPendingRequestsCharitiesResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/requestCharity/:id',
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get a Pending Request for Charity by Id`);
        const pendingRequestCharityResponse =
          await adminUseCaseInstance.getPendingRequestCharityById(req, res, next);
        return res.json(pendingRequestCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/confirmedCharity/requestsPaymentMethods/:id',
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get Pending Requests payment account`);
        const getCharityPaymentsRequestsByIdResponse =
          await adminUseCaseInstance.getPendingPaymentRequestsForConfirmedCharityById(req);
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
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get all Pending Requests payment account`);
        const allRequestsPaymentMethodsResponse =
          await adminUseCaseInstance.getAllRequestsPaymentMethodsForConfirmedCharities();
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get confirm a charity`);
        const confirmCharityResponse: ConfirmPendingCharity =
          await adminUseCaseInstance.confirmCharity(req);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get reject a charity`);
        const rejectCharityResponse: ConfirmPendingCharity =
          await adminUseCaseInstance.rejectCharity(req);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get confirm a payment account for charity`);
        const confirmPaymentAccountResponse: ConfirmPendingCharity =
          await adminUseCaseInstance.confirmPaymentAccountRequestForConfirmedCharities(req);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Admin API was called to get reject a payment account for charity`);
        const rejectPaymentAccountResponse =
          await adminUseCaseInstance.rejectPaymentAccountRequestForConfirmedCharities(
            req,
            res,
            next
          );
        return res.json(rejectPaymentAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  expressApp.use('/api/admin', router);
}
