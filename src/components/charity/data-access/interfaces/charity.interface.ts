import mongoose, { Document } from 'mongoose';
import { ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
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
  location: ICharityLocation;
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
  paymentMethods: ICharityPaymentMethod;
  paymentId: string;
}
export interface DataForSendDocs extends ICharityDocs {}

export interface CharityPaymentMethodBankAccount {
  enable?: boolean;
  accNumber?: string;
  iban?: string;
  swiftCode?: string;
  bankDocs: string[];
  // _id: mongoose.Types.ObjectId;
}

/**
 * Charity Docs [docs & paymentDocs]
 */
export type ICharityDocs = {
  charityDocs: {
    docs1: string[] | mongoose.Types.Array<string>;
    docs2: string[] | mongoose.Types.Array<string>;
    docs3: string[] | mongoose.Types.Array<string>;
    docs4: string[] | mongoose.Types.Array<string>;
  };
  paymentMethods: {
    bankAccount: {
      accNumber?: string;
      iban?: string;
      swiftCode?: string;
      bankDocs: string[];
    };
    fawry: {
      number?: string;
      fawryDocs: string[];
    };
    vodafoneCash: {
      number?: string;
      vodafoneCashDocs: string[];
    };
  };
};

export interface CharityPaymentMethodFawry {
  enable?: boolean;
  number?: string;
  fawryDocs: string[];
//   _id: mongoose.Types.ObjectId;
}

export type CharityPaymentMethodVodafoneCash = {
  enable?: boolean;
  number?: string;
  vodafoneCashDocs: string[];
//   _id: mongoose.Types.ObjectId;
};

export interface ICharityPaymentMethod extends Document {
  bankAccount: CharityPaymentMethodBankAccount[];
  fawry: CharityPaymentMethodFawry[];
  vodafoneCash: CharityPaymentMethodVodafoneCash[];
  //   _id: mongoose.Types.ObjectId;
}

export interface ICharityDonorRequest {
  user: IUserDocument['_id'];
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
}

export interface ICharityLocation extends Document{
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
    isVerified?: boolean;
    verificationDate?: Date | number | null;
  };
  phoneVerification: {
    isVerified?: boolean;
    verificationDate?: Date | number | null;
  };
  isEnabled: boolean;
  isConfirmed: boolean;
  isPending: boolean;
  paymentMethods?: ICharityPaymentMethod;
  rate?: number;
  donorRequests: ICharityDonorRequest[];
  currency: string[];
  location: ICharityLocation[];
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

// export interface CharityPaymentMethodBankAccountDocument {
//     enable?: boolean;
//     accNumber?: string;
//     iban?: string;
//     swiftCode?: string;
//     bankDocs: mongoose.Types.Array<string>;
//     // _id: mongoose.Types.ObjectId;
//   };

// export interface CharityPaymentMethodFawryDocument {
//   enable?: boolean;
//   number?: string;
//   fawryDocs: mongoose.Types.Array<string>;
// //   _id: mongoose.Types.ObjectId;
// };

// export type CharityPaymentMethodVodafoneCashDocument =
//   mongoose.Types.Subdocument & {
//     enable?: boolean;
//     number?: string;
//     vodafoneCashDocs: mongoose.Types.Array<string>;
//     // _id: mongoose.Types.ObjectId;
//   };

// export interface ICharityPaymentMethodDocument extends Document {
//     bankAccount: mongoose.Types.DocumentArray<CharityPaymentMethodBankAccount>;
//     fawry: mongoose.Types.DocumentArray<CharityPaymentMethodFawry>;
//     vodafoneCash: mongoose.Types.DocumentArray<CharityPaymentMethodVodafoneCash>;
//     // _id: mongoose.Types.ObjectId;
// };
export interface ICharityPaymentMethodDocument extends Document {
  bankAccount: CharityPaymentMethodBankAccount[];
  fawry:CharityPaymentMethodFawry[];
  vodafoneCash:CharityPaymentMethodVodafoneCash[];
//   _id: mongoose.Types.ObjectId;
}
export type ICharityDonorRequestDocument = mongoose.Types.Subdocument & {
  user: IUserDocument['_id'] | IUserDocument;
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
};

// export type ICharityLocationDocument = mongoose.Types.Subdocument & {
//     governorate:
//         | 'Alexandria'
//         | 'Assiut'
//         | 'Aswan'
//         | 'Beheira'
//         | 'Bani Suef'
//         | 'Cairo'
//         | 'Daqahliya'
//         | 'Damietta'
//         | 'Fayyoum'
//         | 'Gharbiya'
//         | 'Giza'
//         | 'Helwan'
//         | 'Ismailia'
//         | 'Kafr El Sheikh'
//         | 'Luxor'
//         | 'Marsa Matrouh'
//         | 'Minya'
//         | 'Monofiya'
//         | 'New Valley'
//         | 'North Sinai'
//         | 'Port Said'
//         | 'Qalioubiya'
//         | 'Qena'
//         | 'Red Sea'
//         | 'Sharqiya'
//         | 'Sohag'
//         | 'South Sinai'
//         | 'Suez'
//         | 'Tanta';
//     city?: string;
//     street?: string;
// };

export interface ICharityDocument extends ICharity, Document {}
