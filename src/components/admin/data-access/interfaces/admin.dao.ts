// import { IUser } from '.';
import {
  AllCharities,
  CharitiesAccountsByAggregation,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ConfirmPendingCharity,
  ConfirmedCharities,
  ICharity,
  ICharityDocs,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { QueryObject } from './admin.interface';

// export interface adminDao {
//   findUser(email: string): Promise<User | null>;
//   findUserById(id: string): Promise<User | null>;
//   createUser(dataInputs: User): Promise<User>;
//   getAllUsers(): Promise<User[]>;
// }

export interface adminServiceSkeleton {
  getAllChariteis(): Promise<{
    charities: AllCharities[];
  }>;
  getAllOrOnePendingRequestsCharities(
    req: Request,
    id: string | null
  ): Promise<{ allPendingCharities: PendingCharities[] }>;

  confirmPaymentAccountRequestForConfirmedCharities(
    req: Request,
    charityId: string,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    paymentAccountID: string
  ): Promise<{
    charity: PendingCharities;
    message: string;
  }>;

  rejectPaymentAccountRequestForConfirmedCharities(
    req: Request,
    charityId: string,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    paymentAccountID: string
  ): Promise<ConfirmPendingCharity>;

  // That mean if charity makes a requestEditCharityPayment (add another acc for receive payment)
  getPendingPaymentRequestsForConfirmedCharityById(
    req: Request,
    id: string
  ): Promise<{
    paymentRequestsAccounts: {
      bankAccount: CharityPaymentMethodBankAccount[] | undefined;
      fawry: CharityPaymentMethodFawry[] | undefined;
      vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined;
    };
  }>;

  getAllRequestsPaymentMethodsForConfirmedCharities(): Promise<{
    allPaymentAccounts: {
      bankAccountRequests: CharitiesAccountsByAggregation[];
      fawryRequests: CharitiesAccountsByAggregation[];
      vodafoneCashRequests: CharitiesAccountsByAggregation[];
    };
  }>;

  confirmCharity(req: Request, id: string): Promise<ConfirmPendingCharity>;

  rejectCharity(req: Request, id: string): Promise<ConfirmPendingCharity>;
}

export interface adminUseCaseSkeleton {
  getAllCharities(): Promise<{
    charities: AllCharities[];
  }>;

  getAllPendingRequestsCharities(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<{ allPendingCharities: PendingCharities[] }>;

  getPendingRequestCharityById(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<{
    pendingCharity: PendingCharities[];
  }>;

  getPendingPaymentRequestsForConfirmedCharityById(req: Request): Promise<{
    CharityPaymentsRequest: {
      bankAccount: CharityPaymentMethodBankAccount[] | undefined;
      fawry: CharityPaymentMethodFawry[] | undefined;
      vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined;
    };
  }>;

  getAllRequestsPaymentMethodsForConfirmedCharities(): Promise<{
    allPendingRequestedPaymentAccounts: {
      bankAccountRequests: CharitiesAccountsByAggregation[];
      fawryRequests: CharitiesAccountsByAggregation[];
      vodafoneCashRequests: CharitiesAccountsByAggregation[];
    };
  }>;

  confirmCharity(req: Request): Promise<ConfirmPendingCharity>;

  rejectCharity(req: Request): Promise<{ message: string; charity: PendingCharities | undefined }>;
  confirmPaymentAccountRequestForConfirmedCharities(
    req: Request
  ): Promise<{ message: string; charity: PendingCharities | undefined }>;
  rejectPaymentAccountRequestForConfirmedCharities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ message: string; charity: PendingCharities | undefined }>;
}

export interface adminUtilsSkeleton {
  getAllPendingPaymentMethodsRequestsForConfirmedCharity(
    paymentMethod: string // bankAccount | fawry...
  ): Promise<CharitiesAccountsByAggregation[]>;

  confirmingCharity(req: Request, charity: PendingCharities): Promise<void>;

  rejectingCharity(req: Request, charity: PendingCharities): Promise<void>;

  checkPaymentMethodAvailability(
    // charity: ICharity,
    charity: PendingCharities,
    paymentMethod: keyof ICharityDocs['paymentMethods'],
    paymentAccountID: string
  ): number;
  getConfirmedCharities(queryObject: QueryObject): Promise<PendingCharities>;

  confirmingPaymentAccount(
    req: Request,
    charity: PendingCharities,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    idx: number
  ): Promise<void>;
  rejectingPaymentAccount(
    req: Request,
    charity: ConfirmedCharities,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    idx: number
  ): Promise<void>;
  resetRegisterOperation(entity: ICharity | IUser): Promise<boolean>;
}
