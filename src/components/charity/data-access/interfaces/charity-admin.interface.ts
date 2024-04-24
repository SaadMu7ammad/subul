import mongoose from 'mongoose';
import { ICharityPaymentMethod, ICharity } from './';
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
export interface CharitiesAccountsByAggregation {
  _id: mongoose.Types.ObjectId;
  name: string;
  paymentMethods: ICharityPaymentMethod; //👈 _id is commented may cuz an issue
}

// export interface PendingCharities extends ICharityDocs {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   isPending?: boolean;
//   isConfirmed?: boolean;
// }
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

type PickMany<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type PendingCharities = PickMany<
  ICharity,
  'name' | 'email' | '_id' | 'charityDocs' | 'paymentMethods'
>;
