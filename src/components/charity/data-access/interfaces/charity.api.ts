import mongoose from 'mongoose';
import {
  ICharityLocation,
  ICharityPaymentMethod,
  ICharityPaymentMethods,
  ICharityDocs,
  ICharity,
} from '.';

export interface DataForPaymentRequestsForConfirmedCharity {
  _id?: mongoose.Types.ObjectId;
  paymentMethods: ICharityPaymentMethod;
}

export interface DataForConfirmResetPassword {
  token: string;
  password: string;
  email: string;
}
export interface DataForEditCharityProfile {
  name: string;
  contactInfo: ICharity['contactInfo'];
  email: string;
  description: string;
  charityLocation: ICharityLocation;
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
  paymentMethods: ICharityPaymentMethods;
  paymentId: string;
}

export interface DataForSendDocs extends ICharityDocs {}
