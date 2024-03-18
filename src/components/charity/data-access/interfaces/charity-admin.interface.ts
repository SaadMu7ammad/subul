import mongoose from 'mongoose';
import { ICharityPaymentMethodDocument ,ICharityDocsDocument} from './';
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
    paymentMethods: ICharityPaymentMethodDocument; //👈 _id is commented may cuz an issue
}

export interface PendingCharities extends ICharityDocsDocument {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    isPending?: boolean;
    isConfirmed?: boolean;
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