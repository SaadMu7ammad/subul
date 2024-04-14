import mongoose from 'mongoose';
import {
  ICharityLocation,
  ICharityPaymentMethod,
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
  paymentMethods: ICharityPaymentMethod;
  paymentId: string;
}

export interface IDataForSendDocs extends ICharityDocs {}
