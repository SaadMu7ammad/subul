import { UserLocation } from '../models/location.model';

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

