import mongoose from 'mongoose';

import {
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ICharity,
  ICharityDocs,
  ICharityLocation,
  ICharityPaymentMethod,
  ICharityPaymentMethods,
} from '.';

export type DataForPaymentRequestsForConfirmedCharity = {
  _id?: mongoose.Types.ObjectId;
  paymentMethods: ICharityPaymentMethod;
};

export type DataForConfirmResetPassword = {
  token: string;
  password: string;
  email: string;
};
export type DataForEditCharityProfile = {
  name: string;
  contactInfo: ICharity['contactInfo'];
  email: string;
  description: string;
  charityLocation: ICharityLocation;
  locationId: string;
};
export type DataForActivateCharityAccount = {
  token: string;
};
export type DataForRequestResetPassword = {
  email: string;
};
export type DataForChangePassword = {
  password: string;
};
export type DataForChangeProfileImage = {
  image: string;
};
export type DataForRequestEditCharityPayments = {
  paymentMethods: ICharityPaymentMethod;
  paymentId: string;
};

export type IDataForSendDocs = ICharityDocs;

export type ActivateCharityAccountResponse = Promise<{
  message: string;
}>;

export type RequestResetPasswordResponse = Promise<{
  message: string;
}>;

export type ConfirmResetPasswordResponse = Promise<{
  message: string;
}>;

export type SendDocsResponse = Promise<{
  paymentMethods: ICharityPaymentMethods | undefined;
  message: string;
}>;

export type ChangePasswordResponse = Promise<{
  message: string;
}>;

export type ShowCharityProfileResponse = { charity: ICharity };

export type EditCharityProfileResponse = Promise<{
  charity: ICharity;
  message: string;
}>;

export type ChangeProfileImageResponse = Promise<{
  image: string;
  message: string;
}>;

export type RequestEditCharityPaymentsResponse = Promise<{
  paymentMethods:
    | CharityPaymentMethodBankAccount
    | CharityPaymentMethodVodafoneCash
    | CharityPaymentMethodFawry;
  message?: string;
}>;

export type logoutResponse = {
  message: string;
};
