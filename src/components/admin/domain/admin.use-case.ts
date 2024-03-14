import { NextFunction, Response } from 'express';

import { AuthedRequest } from '../../auth/user/data-access/auth.interface';
import { adminService } from './admin.service';
import { NotFoundError } from '../../../libraries/errors/components';
import {
  AllPaymentAccounts,
  AllPendingRequestsCharitiesResponse,
  AllPendingRequestsPaymentMethods,
  ConfirmPendingCharity,
  ICharityDocs,
  PendingRequestCharityResponse,
} from '../../charity/data-access/interfaces/charity.interface';

const getAllPendingRequestsCharities = async (
  _req: AuthedRequest,
  _res: Response,
  _next: NextFunction
): Promise<AllPendingRequestsCharitiesResponse> => {
  const charities: AllPendingRequestsCharitiesResponse =
    await adminService.getAllOrOnePendingRequestsCharities();
  return { allPendingCharities: charities.allPendingCharities };
};

const getPendingRequestCharityById = async (
  req: AuthedRequest,
  _res: Response,
  _next: NextFunction
): Promise<PendingRequestCharityResponse> => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const pendingRequestCharityById: AllPendingRequestsCharitiesResponse =
    await adminService.getAllOrOnePendingRequestsCharities(id);
  return { pendingCharity: pendingRequestCharityById.allPendingCharities };
};

const getPendingPaymentRequestsForConfirmedCharityById = async (
  req: AuthedRequest,
  _res: Response,
  _next: NextFunction
) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  // {
  //   paymentRequestsAccounts: { bankAccount: [], fawry: [], vodafoneCash: [ [Object] ] }
  // } 👇
  const paymentRequests =
    await adminService.getPendingPaymentRequestsForConfirmedCharityById(id);

  return { CharityPaymentsRequest: paymentRequests.paymentRequestsAccounts };
};

const getAllRequestsPaymentMethodsForConfirmedCharities = async (
  _req: AuthedRequest,
  _res: Response,
  _next: NextFunction
): Promise<AllPendingRequestsPaymentMethods> => {
  const allPaymentAccounts: AllPaymentAccounts =
    await adminService.getAllRequestsPaymentMethodsForConfirmedCharities();
  return {
    allPendingRequestedPaymentAccounts: allPaymentAccounts.allPaymentAccounts,
  };
};

const confirmCharity = async (
  req: AuthedRequest,
  _res: Response,
  _next: NextFunction
): Promise<ConfirmPendingCharity> => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const confirmedCharity = (await adminService.confirmCharity(
    id
  )) as ConfirmPendingCharity;

  return {
    message: confirmedCharity.message,
    charity: confirmedCharity.charity,
  };
};

const rejectCharity = async (
  req: AuthedRequest,
  _res: Response,
  _next: NextFunction
) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const rejectedCharity = (await adminService.rejectCharity(
    id
  )) as ConfirmPendingCharity;

  return {
    message: rejectedCharity.message,
    charity: rejectedCharity.charity,
  };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (
  req: AuthedRequest,
  _res: Response,
  _next: NextFunction
) => {
  const { id }: { id?: string } = req.params; //charityId

  const {
    paymentMethod,
    paymentAccountID,
  }: {
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods']; // Restrict the possible values for the paymentMethod
    paymentAccountID: string;
  } = req.body;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const confirmedPaymentAccount: ConfirmPendingCharity =
    await adminService.confirmPaymentAccountRequestForConfirmedCharities(
      id,
      paymentMethod,
      paymentAccountID
    );

  return {
    charity: confirmedPaymentAccount.charity,
    message: confirmedPaymentAccount.message,
  };
};

const rejectPaymentAccountRequestForConfirmedCharities = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id }: { id?: string } = req.params; //charityId
  const {
    paymentMethod,
    paymentAccountID,
  }: {
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods']; // Restrict the possible values for the paymentMethod
    paymentAccountID: string;
  } = req.body;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const rejectedPaymentAccount: ConfirmPendingCharity =
    await adminService.rejectPaymentAccountRequestForConfirmedCharities(
      id,
      paymentMethod,
      paymentAccountID
    );

  return {
    charity: rejectedPaymentAccount.charity,
    message: rejectedPaymentAccount.message,
  };
};
export const adminUseCase = {
  getAllPendingRequestsCharities,
  getPendingRequestCharityById,
  confirmCharity,
  rejectCharity,
  getAllRequestsPaymentMethodsForConfirmedCharities,
  getPendingPaymentRequestsForConfirmedCharityById,
  confirmPaymentAccountRequestForConfirmedCharities,
  rejectPaymentAccountRequestForConfirmedCharities,
};
