import { Document, Document } from 'mongoose';
import { ITransactionDocument } from '../../../transaction/data-access/interfaces/transaction.interface';

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
  transactions: ITransactionDocument['_id'][];
  // _id: mongoose.Types.ObjectId;
  // createdAt: Date;
  // updatedAt: Date;
}
export interface IUserDocument extends IUser, Document {}

export interface IUserResponse {
  // emailEdited?: boolean;
  emailAlert?: boolean;
  user: Partial<IUserDocument>;
  message?: string;
  token?: string;
}

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
