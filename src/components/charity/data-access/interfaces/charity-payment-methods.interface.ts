import { ICharityPaymentMethod } from '.';

export type CharityPaymentMethodBankAccount = ICharityPaymentMethod['bankAccount'] ;

export type CharityPaymentMethodVodafoneCash= ICharityPaymentMethod['vodafoneCash'] ;

export type CharityPaymentMethodFawry= ICharityPaymentMethod['fawry'] ;

export interface RequestPaymentMethodsObject {
    bankAccount: Omit<CharityPaymentMethodBankAccount, 'enable'>[];
    fawry: Omit<CharityPaymentMethodFawry, 'enable'>[];
    vodafoneCash: Omit<CharityPaymentMethodVodafoneCash, 'enable'>[];
}

export type PaymentMethodNames = 'bankAccount' | 'fawry' | 'vodafoneCash';