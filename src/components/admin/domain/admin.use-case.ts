import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '../../../libraries/errors/components';
import { ConfirmPendingCharity, ICharityDocs } from '../../charity/data-access/interfaces';
import { adminService } from './admin.service';

const getAllPendingRequestsCharities = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  const charities = await adminService.getAllOrOnePendingRequestsCharities();
  return { allPendingCharities: charities.allPendingCharities };
};

const getPendingRequestCharityById = async (req: Request, _res: Response, _next: NextFunction) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const pendingRequestCharityById = await adminService.getAllOrOnePendingRequestsCharities(id);
  return { pendingCharity: pendingRequestCharityById.allPendingCharities };
};

const getPendingPaymentRequestsForConfirmedCharityById = async (req: Request) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  // {
  //   paymentRequestsAccounts: { bankAccount: [], fawry: [], vodafoneCash: [ [Object] ] }
  // } 👇
  const paymentRequests = await adminService.getPendingPaymentRequestsForConfirmedCharityById(id);

  return { CharityPaymentsRequest: paymentRequests.paymentRequestsAccounts };
};

const getAllRequestsPaymentMethodsForConfirmedCharities = async () => {
  const allPaymentAccounts = await adminService.getAllRequestsPaymentMethodsForConfirmedCharities();
  return {
    allPendingRequestedPaymentAccounts: allPaymentAccounts.allPaymentAccounts,
  };
};

const confirmCharity = async (req: Request): Promise<ConfirmPendingCharity> => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const confirmedCharity = await adminService.confirmCharity(id);

  return {
    message: confirmedCharity.message,
    charity: confirmedCharity.charity,
  };
};

const rejectCharity = async (req: Request) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('no id found to make a rejection');

  const rejectedCharity = await adminService.rejectCharity(id);

  return {
    message: rejectedCharity.message,
    charity: rejectedCharity.charity,
  };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (req: Request) => {
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
  req: Request,
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
