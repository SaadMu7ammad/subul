import mongoose, { Document } from 'mongoose';
import { ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
import {
    ICharityPaymentMethodDocument,
    CharityPaymentMethodBankAccountDocument,
    CharityPaymentMethodFawryDocument,
    CharityPaymentMethodVodafoneCashDocument,
} from './charity-payment-methods.interface';

/**
 * Plain Charity Interface
 */
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
    charityLocation: ICharityLocationDocument[];
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
/**
 * Charity Document Interface
 */
export interface ICharityDocument extends ICharity, Document {}


// DataForRequestEditCharityPayments

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
    charity: ICharityDocument;
    message?: string;
}

export interface IPaymentCharityDocumentResponse {
    paymentMethods:
        | CharityPaymentMethodVodafoneCashDocument
        | CharityPaymentMethodFawryDocument
        | CharityPaymentMethodBankAccountDocument;
    message?: string;
}

export type TypeWithAtLeastOneProperty<T> = {
    [K in keyof T]: T[K];
};
