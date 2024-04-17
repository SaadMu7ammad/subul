import { Document } from 'mongoose';
import { ITransactionDocument } from '../../../transaction/data-access/interfaces/transaction.interface';

import { locationUser } from '../models/location.model';

// export type UserLocation = {
//   governorate?:
//     | 'Alexandria'
//     | 'Assiut'
//     | 'Aswan'
//     | 'Beheira'
//     | 'Bani Suef'
//     | 'Cairo'
//     | 'Daqahliya'
//     | 'Damietta'
//     | 'Fayyoum'
//     | 'Gharbiya'
//     | 'Giza'
//     | 'Helwan'
//     | 'Ismailia'
//     | 'Kafr El Sheikh'
//     | 'Luxor'
//     | 'Marsa Matrouh'
//     | 'Minya'
//     | 'Monofiya'
//     | 'New Valley'
//     | 'North Sinai'
//     | 'Port Said'
//     | 'Qalioubiya'
//     | 'Qena'
//     | 'Red Sea'
//     | 'Sharqiya'
//     | 'Sohag'
//     | 'South Sinai'
//     | 'Suez'
//     | 'Tanta';
//   city?: string;
//   street?: string;
// };

export type IUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  isAdmin: boolean;
  pointsOnDonations: number;
  totalDonationsAmount?: number;
  locationUser: locationUser;
  gender: 'male' | 'female';
  phone?: string;
  verificationCode?: string | null;
  emailVerification: {
    isVerified?: boolean;
    verificationDate?: Date | number;
  };
  phoneVerification: {
    isVerified?: boolean;
    verificationDate?: Date | number;
  };
  isEnabled: boolean;
  transactions: ITransactionDocument['_id'][];
  // _id: mongoose.Types.ObjectId;
  // createdAt: Date;
  // updatedAt: Date;
};

export type IUserModifed = {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
  // locationUser?: UserLocation;
  locationUser?: locationUser;
  gender?: 'male' | 'female';
  phone?: string;
};

export type IUserDocument = IUser & Document;

export type EditProfile = {
  emailAlert: boolean;
  user: IUserModifed;
};

export type EditUserProfileResponse = {
  user: IUserModifed;
  message: string;
};

export type IUserResponse = {
  // emailEdited?: boolean;
  emailAlert?: boolean;
  // user: Partial<IUserDocument>;
  user: Partial<IUserDocument>;
  message?: string;
  token?: string;
};

export type dataForResetEmail = {
  email: string;
};
export type dataForChangePassword = {
  password: string;
};
export type dataForConfirmResetEmail = {
  email: string;
  token: string;
  password: string;
};
export type dataForActivateAccount = {
  token: string;
};
