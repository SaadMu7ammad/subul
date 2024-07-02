// import { Request } from 'express';
// import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
// import { ICharity } from '../../../charity/data-access/interfaces/charity.interface';
// export interface AuthedRequest extends Request {
//     user: IUserDocument;
//     charity: ICharityDocument;
import { IUser } from '@components/user/data-access/interfaces';

export interface IloginData {
  email: IUser['email'];
  password: IUser['password'];
}

// Define RegisterUserInputData based on the structure of the User type
export type RegisterUserInputData = {
  name: IUser['name'];
  email: IUser['email'];
  locationUser: IUser['userLocation'];
  gender: IUser['gender'];
  phone: IUser['phone'];
  password: IUser['password'];
};

export interface UserObject {
  _id: IUser['_id'];
  name: IUser['name'];
  email: IUser['email'];
}

export type UserResponseBasedOnUserVerification = {
  user: IUser;
  emailAlert: boolean;
  token?: string;
  isVerified: boolean;
};
