import mongoose, { Model,Document } from 'mongoose';
import { Transaction } from '../../../transaction/data-access/interfaces/transaction.interface';
import UserModel from '../models/user.model';
export interface UserLocation {
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
}


export interface IUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  isAdmin: boolean;
  pointsOnDonations: number;
  totalDonationsAmount?: number;
  locationUser: UserLocation;
  gender: 'male' | 'female';
  phone?: string;
  verificationCode?: string;
  emailVerification: {
    isVerified?: boolean;
    verificationDate?: Date;
  };
  phoneVerification: {
    isVerified?: boolean;
    verificationDate?: Date;
  };
  isEnabled: boolean;
  transactions: (Transaction['_id'] | Transaction)[];
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserDocument extends Document {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  isAdmin: boolean;
  pointsOnDonations: number;
  totalDonationsAmount?: number;
  locationUser: UserLocation;
  gender: 'male' | 'female';
  phone?: string;
  verificationCode?: string;
  emailVerification: {
    isVerified?: boolean;
    verificationDate?: Date;
  };
  phoneVerification: {
    isVerified?: boolean;
    verificationDate?: Date;
  };
  isEnabled: boolean;
  transactions: (Transaction['_id'] | Transaction)[];
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserResponse {
  emailEdited?: boolean;
  user: IUserDocument;
  message?: string;
}
// export interface IUserResponseModel {
//   emailEdited?: boolean;
//   user: IUser;
// }
// export interface IUserDocument extends IUser, Document { }
// export interface IUserDocument extends IUser, Document {}
// export interface IUserResponseDocument extends IUserResponse, Document {}
// export interface IUserModel extends Model<IUserDocument> {}

export interface dataForResetEmail {
  email: string;
}
export interface dataForChangePassword {
  password: string;
}
export interface dataForConfirmResetEmail {
  email: string;
  token: string;
  password: string;
}
export interface dataForActivateAccount {
  token: string;
}
// export type UserLocationDocument =
//   mongoose.Document<mongoose.Types.ObjectId> & {
//     governorate:
//       | 'Alexandria'
//       | 'Assiut'
//       | 'Aswan'
//       | 'Beheira'
//       | 'Bani Suef'
//       | 'Cairo'
//       | 'Daqahliya'
//       | 'Damietta'
//       | 'Fayyoum'
//       | 'Gharbiya'
//       | 'Giza'
//       | 'Helwan'
//       | 'Ismailia'
//       | 'Kafr El Sheikh'
//       | 'Luxor'
//       | 'Marsa Matrouh'
//       | 'Minya'
//       | 'Monofiya'
//       | 'New Valley'
//       | 'North Sinai'
//       | 'Port Said'
//       | 'Qalioubiya'
//       | 'Qena'
//       | 'Red Sea'
//       | 'Sharqiya'
//       | 'Sohag'
//       | 'South Sinai'
//       | 'Suez'
//       | 'Tanta';
//     city?: string;
//     street?: string;
//   };

// export type UserDocument = mongoose.Document<
//   mongoose.Types.ObjectId,
//   UserQueries
// > &
//   UserMethods & {
//     name: {
//       firstName: string;
//       lastName: string;
//     };
//     email: string;
//     password: string;
//     isAdmin: boolean;
//     pointsOnDonations: number;
//     totalDonationsAmount?: number;
//     location: UserLocationDocument;
//     gender: 'male' | 'female';
//     phone?: string;
//     verificationCode?: string;
//     emailVerification: {
//       isVerified?: boolean;
//       verificationDate?: Date;
//     };
//     phoneVerification: {
//       isVerified?: boolean;
//       verificationDate?: Date;
//     };
//     isEnabled: boolean;
//     transactions: mongoose.Types.Array<
//       TransactionDocument['_id'] | TransactionDocument
//     >;
//     _id: mongoose.Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//   };