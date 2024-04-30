import { ICharity } from '.';

type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ICharityPaymentMethods = Exclude<
  ICharity['paymentMethods'],
  undefined
>;

export type PaymentMethodsNames = keyof ICharityPaymentMethods;

export type ICharityPaymentMethod = {
  [k in PaymentMethodsNames]: Unpacked<ICharityPaymentMethods[k]>;
};
export type CharityPaymentMethodBankAccount =
  ICharityPaymentMethod['bankAccount'];

export type CharityPaymentMethodVodafoneCash =
  ICharityPaymentMethod['vodafoneCash'];

export type CharityPaymentMethodFawry = ICharityPaymentMethod['fawry'];

export type RequestPaymentMethodsObject = {
  bankAccount: Omit<CharityPaymentMethodBankAccount, 'enable'>[];
  fawry: Omit<CharityPaymentMethodFawry, 'enable'>[];
  vodafoneCash: Omit<CharityPaymentMethodVodafoneCash, 'enable'>[];
};

export type IRequestPaymentCharityDocumentResponse = {
  paymentMethods:
    | CharityPaymentMethodBankAccount
    | CharityPaymentMethodVodafoneCash
    | CharityPaymentMethodFawry;
  message?: string;
};
