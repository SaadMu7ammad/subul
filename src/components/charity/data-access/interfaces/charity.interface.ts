import mongoose, { Document} from 'mongoose';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
import {
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
} from './charity-payment-methods.interface';
import { ICharity } from '../models/charity.model';

export type ICharityPaymentMethod = Exclude<
  ICharity['paymentMethods'],
  undefined
>;

// RENAME IT LATER (DOCUMENT NAME ABOUT DB)👇
export interface ICharityDocsDocument extends Document {
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

export interface ICharityDocs {
  charityDocs: {
    docs1: string[] | mongoose.Types.Array<string>;
    docs2: string[] | mongoose.Types.Array<string>;
    docs3: string[] | mongoose.Types.Array<string>;
    docs4: string[] | mongoose.Types.Array<string>;
  };
  paymentMethods: {
    // bankAccount: [{
    //   accNumber?: string;
    //   iban?: string;
    //   swiftCode?: string;
    //   bankDocs: string[];
    // }];
    bankAccount: [
      {
        accNumber?: string | undefined;
        iban?: string | undefined;
        swiftCode?: string | undefined;
        bankDocs: string[];
      }
    ];
    fawry: [
      {
        number?: string;
        fawryDocs: string[];
      }
    ];
    vodafoneCash: [
      {
        number?: string;
        vodafoneCashDocs: string[];
      }
    ];
  };
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

export interface ICharityDonorRequestDocument {
  user: IUserDocument['_id'];
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
}

export interface ICharityDocumentResponse {
  editedEmail?: boolean;
  charity: ICharity;
  message?: string;
}

export interface IPaymentCharityDocumentResponse {
  paymentMethods:
    | CharityPaymentMethodVodafoneCash
    | CharityPaymentMethodFawry
    | CharityPaymentMethodBankAccount;
  message?: string;
}

export type TypeWithAtLeastOneProperty<T> = {
  [K in keyof T]: T[K];
};
