import {
  AllCharities,
  CharitiesAccountsByAggregation,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ConfirmPendingCharity,
  ICharityDocs,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components';
import { NextFunction, Request, Response } from 'express';

import { adminUseCaseSkeleton } from '../data-access/interfaces/admin.dao';
import { adminServiceClass } from './admin.service';

export class adminUseCaseClass implements adminUseCaseSkeleton {
  adminServiceInstance: adminServiceClass;

  constructor() {
    this.adminServiceInstance = new adminServiceClass();
  }
  async getAllCharities(): Promise<{
    charities: AllCharities[];
  }> {
    const charities = await this.adminServiceInstance.getAllChariteis();
    return charities;
  }

  async getAllUsers() {
    const users = await this.adminServiceInstance.getAllUsers();
    return users;
  }

  async getCharityById(req: Request, res: Response, next: NextFunction) {
    const { id }: { id?: string } = req.params;

    if (!id) throw new NotFoundError('no id found to get a charity');

    const charity = await this.adminServiceInstance.getCharityById(id);
    return charity;
  }

  async getAllPendingRequestsCharities(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<{ allPendingCharities: PendingCharities[] }> {
    const charities = await this.adminServiceInstance.getAllOrOnePendingRequestsCharities(_req);
    return { allPendingCharities: charities.allPendingCharities };
  }

  async getPendingRequestCharityById(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<{
    pendingCharity: PendingCharities[];
  }> {
    const { id }: { id?: string } = req.params;

    if (!id) throw new NotFoundError('no id found to make a rejection');

    const pendingRequestCharityById =
      await this.adminServiceInstance.getAllOrOnePendingRequestsCharities(req, id);
    return { pendingCharity: pendingRequestCharityById.allPendingCharities };
  }

  async getPendingPaymentRequestsForConfirmedCharityById(req: Request): Promise<{
    CharityPaymentsRequest: {
      bankAccount: CharityPaymentMethodBankAccount[] | undefined;
      fawry: CharityPaymentMethodFawry[] | undefined;
      vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined;
    };
  }> {
    const { id }: { id?: string } = req.params;

    if (!id) throw new NotFoundError('no id found to make a rejection');

    // {
    //   paymentRequestsAccounts: { bankAccount: [], fawry: [], vodafoneCash: [ [Object] ] }
    // } 👇
    const paymentRequests =
      await this.adminServiceInstance.getPendingPaymentRequestsForConfirmedCharityById(req, id);

    return { CharityPaymentsRequest: paymentRequests.paymentRequestsAccounts };
  }

  async getAllRequestsPaymentMethodsForConfirmedCharities(): Promise<{
    allPendingRequestedPaymentAccounts: {
      bankAccountRequests: CharitiesAccountsByAggregation[];
      fawryRequests: CharitiesAccountsByAggregation[];
      vodafoneCashRequests: CharitiesAccountsByAggregation[];
    };
  }> {
    const allPaymentAccounts =
      await this.adminServiceInstance.getAllRequestsPaymentMethodsForConfirmedCharities();
    return {
      allPendingRequestedPaymentAccounts: allPaymentAccounts.allPaymentAccounts,
    };
  }

  async confirmCharity(req: Request): Promise<ConfirmPendingCharity> {
    const { id }: { id?: string } = req.params;

    if (!id) throw new NotFoundError('no id found to make a rejection');

    const confirmedCharity = await this.adminServiceInstance.confirmCharity(req, id);

    return {
      message: confirmedCharity.message,
      charity: confirmedCharity.charity,
    };
  }

  async rejectCharity(
    req: Request
  ): Promise<{ message: string; charity: PendingCharities | undefined }> {
    const { id }: { id?: string } = req.params;

    if (!id) throw new NotFoundError('no id found to make a rejection');

    const rejectedCharity = await this.adminServiceInstance.rejectCharity(req, id);

    return {
      message: rejectedCharity.message,
      charity: rejectedCharity.charity,
    };
  }

  async confirmPaymentAccountRequestForConfirmedCharities(
    req: Request
  ): Promise<{ message: string; charity: PendingCharities | undefined }> {
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
      await this.adminServiceInstance.confirmPaymentAccountRequestForConfirmedCharities(
        id,
        paymentMethod,
        paymentAccountID
      );

    return {
      charity: confirmedPaymentAccount.charity,
      message: confirmedPaymentAccount.message,
    };
  }

  async rejectPaymentAccountRequestForConfirmedCharities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ message: string; charity: PendingCharities | undefined }> {
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
      await this.adminServiceInstance.rejectPaymentAccountRequestForConfirmedCharities(
        id,
        paymentMethod,
        paymentAccountID
      );

    return {
      charity: rejectedPaymentAccount.charity,
      message: rejectedPaymentAccount.message,
    };
  }
}
// export const adminUseCase = {
//   getAllCharities,
//   getAllPendingRequestsCharities,
//   getPendingRequestCharityById,
//   confirmCharity,
//   rejectCharity,
//   getAllRequestsPaymentMethodsForConfirmedCharities,
//   getPendingPaymentRequestsForConfirmedCharityById,
//   confirmPaymentAccountRequestForConfirmedCharities,
//   rejectPaymentAccountRequestForConfirmedCharities,
// };
