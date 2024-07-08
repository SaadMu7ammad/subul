import { HydratedDocument } from 'mongoose';

import { ICharity, IPaymentMethods } from './';

export interface AllPendingRequestsPaymentMethods {
  allPendingRequestedPaymentAccounts: CharitiesAccounts;
}
export interface AllPaymentAccounts {
  allPaymentAccounts: CharitiesAccounts;
}

export interface CharitiesAccounts {
  bankAccountRequests: CharitiesAccountsByAggregation[];
  fawryRequests: CharitiesAccountsByAggregation[];
  vodafoneCashRequests: CharitiesAccountsByAggregation[];
}

export interface ConfirmedCharities extends PendingCharities {}

export interface ConfirmPendingCharity {
  charity: PendingCharities | undefined;
  message: string;
}
export interface AllPendingRequestsCharitiesResponse {
  allPendingCharities: PendingCharities[];
}
export interface PendingRequestCharityResponse {
  pendingCharity: PendingCharities[];
}

export type AllCharities = Pick<ICharity, 'name' | 'email' | '_id' | 'isConfirmed' | 'isPending'>;

export type PendingCharities = HydratedDocument<
  Pick<
    ICharity,
    'name' | 'email' | '_id' | 'charityDocs' | 'paymentMethods' | 'isConfirmed' | 'isPending'
  >
>;

export type DataForForConfirmedCharity = Pick<ICharity, '_id' | 'paymentMethods'>;
export interface CharitiesAccountsByAggregation extends DataForForConfirmedCharity {
  name: string;
}

export type CharitiesAccountsOfPaymentMethods = Pick<
  IPaymentMethods,
  'bankAccount' | 'fawry' | 'vodafoneCash'
>;

export type AccType =
  CharitiesAccountsOfPaymentMethods[keyof CharitiesAccountsOfPaymentMethods][number];
