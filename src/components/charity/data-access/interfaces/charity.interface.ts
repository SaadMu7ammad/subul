import mongoose, { Document } from 'mongoose';
import { ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';

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

// DataForRequestEditCharityPayments
export interface DataForPaymentRequestsForConfirmedCharity {
  _id?: mongoose.Types.ObjectId;
  paymentMethods: ICharityPaymentMethodDocument;
}
export interface DataForConfirmResetPassword {
  token: string;
  password: string;
  email: string;
}
export interface DataForEditCharityProfile {
  name: string;
  contactInfo: {
    email: string;
    phone: number;
    websiteUrl: string;
  };
  email: string;
  description: string;
  charitylocation: ICharityLocationDocument;
  locationId: string;
}
export interface DataForActivateCharityAccount {
  token: string;
}
export interface DataForRequestResetPassword {
  email: string;
}
export interface DataForChangePassword {
  password: string;
}
export interface DataForChangeProfileImage {
  image: string;
}
export interface DataForRequestEditCharityPayments {
  paymentMethods: ICharityPaymentMethodDocument;
  paymentId: string;
}
export interface DataForSendDocs extends ICharityDocs {}

/**
 * Charity Docs [docs & paymentDocs]
 */
export interface ICharityDocs {
  charityDocs?: {
    docs1: string[] | mongoose.Types.Array<string>;
    docs2: string[] | mongoose.Types.Array<string>;
    docs3: string[] | mongoose.Types.Array<string>;
    docs4: string[] | mongoose.Types.Array<string>;
  };
  paymentMethods?: {
    bankAccount: {
      enable?: boolean;
      accNumber?: string;
      iban?: string;
      swiftCode?: string;
      bankDocs: string[];
    }[];
    fawry: {
      enable?: boolean;
      number?: string;
      fawryDocs: string[];
    }[];
    vodafoneCash: {
      enable?: boolean;
      number?: string;
      vodafoneCashDocs: string[];
    }[];
  };
}
export interface PendingCharities extends ICharityDocs, Document {
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
// export interface PendingCharities extends Document {
//   charityDocs: {
//     docs1: string[] | mongoose.Types.Array<string>;
//     docs2: string[] | mongoose.Types.Array<string>;
//     docs3: string[] | mongoose.Types.Array<string>;
//     docs4: string[] | mongoose.Types.Array<string>;
//   };
//   paymentMethods: ICharityPaymentMethodDocument;
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
// }

export interface CharityPaymentMethodBankAccount {
  enable?: boolean;
  accNumber?: string;
  iban?: string;
  swiftCode?: string;
  bankDocs: string[];
  // _id: mongoose.Types.ObjectId;
}
export interface CharityPaymentMethodFawry {
  enable?: boolean;
  number?: string;
  fawryDocs: string[];
  //   _id: mongoose.Types.ObjectId;
}

export interface CharityPaymentMethodVodafoneCash {
  enable?: boolean;
  number?: string;
  vodafoneCashDocs: string[];
  //   _id: mongoose.Types.ObjectId;
}
export interface ICharityPaymentMethodDocument extends Document {
  bankAccount: CharityPaymentMethodBankAccount[];
  fawry: CharityPaymentMethodFawry[];
  vodafoneCash: CharityPaymentMethodVodafoneCash[];
  // _id: mongoose.Types.ObjectId;
}

export interface ICharityDonorRequest {
  user: IUserDocument['_id'];
  requestTitle: string;
  requestMessage: string;
  // _id: mongoose.Types.ObjectId;
}

export interface ICharityLocationDocument extends Document {
  governorate:
    | 'Alexandria'
    | 'Assiut'
    | 'Aswan'
    | 'Beheira'
    | 'Bani Suef'
    | 'Cairo'
    | 'Daqahliya'
    | 'Damietta'
    | 'Fayyoum'
    | 'Gharbiya'
    | 'Giza'
    | 'Helwan'
    | 'Ismailia'
    | 'Kafr El Sheikh'
    | 'Luxor'
    | 'Marsa Matrouh'
    | 'Minya'
    | 'Monofiya'
    | 'New Valley'
    | 'North Sinai'
    | 'Port Said'
    | 'Qalioubiya'
    | 'Qena'
    | 'Red Sea'
    | 'Sharqiya'
    | 'Sohag'
    | 'South Sinai'
    | 'Suez'
    | 'Tanta';
  city?: string;
  street?: string;
  //   _id: mongoose.Types.ObjectId;
}

export interface ICharity {
  cases: ICaseDocument['_id'][];
  image: string;
  email: string;
  password: string;
  name: string;
  contactInfo: {
    email: string;
    phone: number;
    websiteUrl: string;
  };
  description: string;
  totalDonationsIncome?: number;
  verificationCode?: string | null;
  emailVerification: {
    isVerified: boolean;
    verificationDate: Date | number | null;
  };
  phoneVerification: {
    isVerified: boolean;
    verificationDate: Date | number | null;
  };
  isEnabled: boolean;
  isConfirmed: boolean;
  isPending: boolean;
  paymentMethods?: ICharityPaymentMethodDocument;
  rate?: number;
  donorRequests: ICharityDonorRequest[];
  currency: string[];
  charitylocation: ICharityLocationDocument[];
  charityInfo: {
    registeredNumber: string;
    establishedDate: string;
  };
  charityDocs: {
    docs1: string[];
    docs2: string[];
    docs3: string[];
    docs4: string[];
  };
  //   _id: mongoose.Types.ObjectId;
  //   createdAt?: Date;
  //   updatedAt?: Date;
}

export interface ICharityPaymentMethodDocument extends Document {
  bankAccount: CharityPaymentMethodBankAccount[];
  fawry: CharityPaymentMethodFawry[];
  vodafoneCash: CharityPaymentMethodVodafoneCash[];
  //   _id: mongoose.Types.ObjectId;
}
export interface ICharityDonorRequestDocument {
  user: IUserDocument['_id'];
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
}

export interface ICharityDocument extends ICharity, Document {}

export interface ICharityDocumentResponse {
  emailEdited?: boolean;
  charity: ICharityDocument;
  message?: string;
}

export interface IPaymentCharityDocumentResponse {
  paymentMethods: ICharityPaymentMethodDocument;
  message?: string;
}
