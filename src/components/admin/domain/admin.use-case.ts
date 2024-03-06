import { NextFunction, Response } from 'express';

import { AuthedRequest } from '../../auth/user/data-access/auth.interface';
import { adminService } from './admin.service';
// import { NotFoundError } from '../../../libraries/errors/components';

const getAllPendingRequestsCharities = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const charities = await adminService.getAllOrOnePendingRequestsCharities();
  return { allPendingCharities: charities.allPendingCharities };
};

// const getPendingRequestCharityById = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   if (!id) throw new NotFoundError('no id found to make a rejection');

//   const pendingRequestCharityById =
//     await adminService.getAllOrOnePendingRequestsCharities(id);
//   return { pendingCharity: pendingRequestCharityById.allPendingCharities };
// };

// const getPendingPaymentRequestsForConfirmedCharityById = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   if (!id) throw new NotFoundError('no id found to make a rejection');

//   const paymentRequests =
//     await adminService.getPendingPaymentRequestsForConfirmedCharityById(id);
//   return { CharityPaymentsRequest: paymentRequests.paymentRequestsAccounts };
// };

// const getAllRequestsPaymentMethodsForConfirmedCharities = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const allPaymentAccounts =
//     await adminService.getAllRequestsPaymentMethodsForConfirmedCharities();
//   return {
//     allPendingRequestedPaymentAccounts: allPaymentAccounts.allPaymentAccounts,
//   };
// };

// const confirmCharity = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   if (!id) throw new NotFoundError('no id found to make a rejection');

//   const confirmedCharity = await adminService.confirmCharity(id);

//   return {
//     message: confirmedCharity.message,
//     charity: confirmedCharity.charity,
//   };
// };

// const rejectCharity = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   if (!id) throw new NotFoundError('no id found to make a rejection');

//   const rejectedCharity = await adminService.rejectCharity(id);

//   return {
//     message: rejectedCharity.message,
//     charity: rejectedCharity.charity,
//   };
// };

// const confirmPaymentAccountRequestForConfirmedCharities = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params; //charityId
//   const { paymentMethod, paymentAccountID } = req.body;
//   if (!id) throw new NotFoundError('no id found to make a rejection');

//   const confirmedPaymentAccount =
//     await adminService.confirmPaymentAccountRequestForConfirmedCharities(
//       id,
//       paymentMethod,
//       paymentAccountID
//     );

//   return {
//     charity: confirmedPaymentAccount.charity,
//     message: confirmedPaymentAccount.message,
//   };
// };
// const rejectPaymentAccountRequestForConfirmedCharities = async (
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params; //charityId
//   const {
//     paymentMethod,
//     paymentAccountID,
//   }: { paymentMethod: string; paymentAccountID: string } = req.body;
//   if (!id) throw new NotFoundError('no id found to make a rejection');
//   const rejectedPaymentAccount =
//     await adminService.rejectPaymentAccountRequestForConfirmedCharities(
//       id,
//       paymentMethod,
//       paymentAccountID
//     );

//   return {
//     charity: rejectedPaymentAccount.charity,
//     message: rejectedPaymentAccount.message,
//   };
// };
export const adminUseCase = {
  getAllPendingRequestsCharities,
  //   getPendingRequestCharityById,
  //   confirmCharity,
  //   rejectCharity,
  //   getAllRequestsPaymentMethodsForConfirmedCharities,
  //   getPendingPaymentRequestsForConfirmedCharityById,
  //   confirmPaymentAccountRequestForConfirmedCharities,
  //   rejectPaymentAccountRequestForConfirmedCharities,
};
