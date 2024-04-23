import { UserLocation } from '../models/location.model';
import { User } from '../models/user.model';

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

// export type IUser = {
//   name: {
//     firstName: string;
//     lastName: string;
//   };
//   email: string;
//   password: string;
//   isAdmin: boolean;
//   pointsOnDonations: number;
//   totalDonationsAmount?: number;
//   userLocation: userLocation;
//   gender: 'male' | 'female';
//   phone?: string;
//   verificationCode?: string | null;
//   emailVerification: {
//     isVerified?: boolean;
//     verificationDate?: Date | number;
//   };
//   phoneVerification: {
//     isVerified?: boolean;
//     verificationDate?: Date | number;
//   };
//   isEnabled: boolean;
//   transactions: ITransactionDocument['_id'][];
//   // _id: mongoose.Types.ObjectId;
//   // createdAt: Date;
//   // updatedAt: Date;
// };

export type IUserModified = {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
  // userLocation?: UserLocation;
  userLocation?: UserLocation;
  gender?: 'male' | 'female';
  phone?: string;
};

// export type IUserDocument = IUser & Document;

export type EditProfile = {
  emailAlert: boolean;
  user: IUserModified;
  message: string;
};

export type EditUserProfileResponse = {
  user: IUserModified;
  message: string;
};

export type IUserResponse = {
  // emailEdited?: boolean;
  emailAlert?: boolean;
  // user: Partial<IUserDocument>;
  user: Partial<User>;
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
