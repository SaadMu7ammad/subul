import express, { Application, NextFunction, Request, Response } from 'express';

import { adminUseCase } from '../../domain/admin.use-case';
import { auth } from '../../../auth/shared/index';
import { isAdmin } from '../../index';
import logger from '../../../../utils/logger';
// import {
//   AllPendingRequestsCharitiesResponse,
//   // AllPendingRequestsPaymentMethods,
//   // ConfirmPendingCharity,
//   // PendingRequestCharityResponse,
// } from '../../../charity/data-access/interfaces/';

export default function defineRoutes(expressApp: Application) {
  const router = express.Router();

  router.get(
    '/AllRequestsCharities',
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(
          `Admin API was called to get All Pending Requests Charities`
        );
        const getAllPendingRequestsCharitiesResponse =
          await adminUseCase.getAllPendingRequestsCharities(req, res, next);
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
        logger.info(
          `Admin API was called to get a Pending Request for Charity by Id`
        );
        const pendingRequestCharityResponse =
          await adminUseCase.getPendingRequestCharityById(req, res, next);
        return res.json(pendingRequestCharityResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  // router.get(
  //   '/confirmedCharity/requestsPaymentMethods/:id',
  //   auth,
  //   isAdmin,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       logger.info(
  //         `Admin API was called to get Pending Requests payment account`
  //       );
  //       const getCharityPaymentsRequestsByIdResponse =
  //         await adminUseCase.getPendingPaymentRequestsForConfirmedCharityById(
  //           req,
  //           res,
  //           next
  //         );
  //       return res.json(getCharityPaymentsRequestsByIdResponse);
  //     } catch (error) {
  //       next(error);
  //       return undefined;
  //     }
  //   }
  // );

  //   router.get(
  //     '/confirmedCharities/AllRequestsPaymentMethods',
  //     auth,
  //     isAdmin,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {

  //         logger.info(
  //           `Admin API was called to get all Pending Requests payment account`
  //         );
  //         const allRequestsPaymentMethodsResponse: AllPendingRequestsPaymentMethods =
  //           await adminUseCase.getAllRequestsPaymentMethodsForConfirmedCharities(
  //             req,
  //             res,
  //             next
  //           );
  //         return res.json(allRequestsPaymentMethodsResponse);
  //       } catch (error) {
  //         next(error);
  //         return undefined;
  //       }
  //     }
  //   );

  //   router.put(
  //     '/confirmrequestsCharities/:id',
  //     auth,
  //     isAdmin,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {

  //         logger.info(`Admin API was called to get confirm a charity`);
  //         const confirmCharityResponse = (await adminUseCase.confirmCharity(
  //           req,
  //           res,
  //           next
  //         )) as ConfirmPendingCharity;
  //         return res.json(confirmCharityResponse);
  //       } catch (error) {
  //         next(error);
  //         return undefined;
  //       }
  //     }
  //   );

  //   router.put(
  //     '/rejectrequestsCharities/:id',
  //     auth,
  //     isAdmin,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {

  //         logger.info(`Admin API was called to get reject a charity`);
  //         const rejectCharityResponse = (await adminUseCase.rejectCharity(
  //           req,
  //           res,
  //           next
  //         )) as ConfirmPendingCharity;
  //         return res.json(rejectCharityResponse);
  //       } catch (error) {
  //         next(error);
  //         return undefined;
  //       }
  //     }
  //   );

  //   router.put(
  //     '/confirmedCharity/confirmrequestPaymentMethod/:id',
  //     auth,
  //     isAdmin,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {

  //         logger.info(
  //           `Admin API was called to get confirm a payment account for charity`
  //         );
  //         const confirmPaymentAccountResponse =
  //           await adminUseCase.confirmPaymentAccountRequestForConfirmedCharities(
  //             req,
  //             res,
  //             next
  //           );
  //         return res.json(confirmPaymentAccountResponse);
  //       } catch (error) {
  //         next(error);
  //         return undefined;
  //       }
  //     }
  //   );

  //   router.put(
  //     '/confirmedCharity/rejectrequestPaymentMethod/:id',
  //     auth,
  //     isAdmin,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {

  //         logger.info(
  //           `Admin API was called to get reject a payment account for charity`
  //         );
  //         const rejectPaymentAccountResponse =
  //           await adminUseCase.rejectPaymentAccountRequestForConfirmedCharities(
  //             req,
  //             res,
  //             next
  //           );
  //         return res.json(rejectPaymentAccountResponse);
  //       } catch (error) {
  //         next(error);
  //         return undefined;
  //       }
  //     }
  //   );
  expressApp.use('/api/admin', router);
}
