import mongoose from 'mongoose';

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
    bankAccount: mongoose.Types.DocumentArray<CharityPaymentMethodBankAccountDocument>;
    fawry: mongoose.Types.DocumentArray<CharityPaymentMethodFawryDocument>;
    vodafoneCash: mongoose.Types.DocumentArray<CharityPaymentMethodVodafoneCashDocument>;
    _id: mongoose.Types.ObjectId;
}
export type ICharityPaymentMethod =
    | CharityPaymentMethodBankAccount
    | CharityPaymentMethodFawry
    | CharityPaymentMethodVodafoneCash;
export interface RequestPaymentMethodsObject {
    bankAccount: Omit<CharityPaymentMethodBankAccount, 'enable'>[];
    fawry: Omit<CharityPaymentMethodFawry, 'enable'>[];
    vodafoneCash: Omit<CharityPaymentMethodVodafoneCash, 'enable'>[];
}

export type PaymentMethodNames = 'bankAccount' | 'fawry' | 'vodafoneCash';

export interface CharityPaymentMethodBankAccountDocument extends Document{
    enable?: boolean;
    accNumber?: string;
    iban?: string;
    swiftCode?: string;
    bankDocs: string[];
    _id: mongoose.Types.ObjectId;
}
export interface CharityPaymentMethodFawryDocument extends Document{
    enable?: boolean;
    number?: string;
    fawryDocs: string[];
    _id: mongoose.Types.ObjectId;
}

export interface CharityPaymentMethodVodafoneCashDocument {
    enable?: boolean;
    number?: string;
    vodafoneCashDocs: string[];
    _id: mongoose.Types.ObjectId;
}