// import { Request } from 'express';
// import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
// import { ICharity } from '../../../charity/data-access/interfaces/charity.interface';
// export interface AuthedRequest extends Request {
//     user: IUserDocument;
//     charity: ICharityDocument;
import { User } from '@components/user/data-access/interfaces';

export interface IloginData {
  email: User['email'];
  password: User['password'];
}

// Define RegisterUserInputData based on the structure of the User type
export type RegisterUserInputData = {
  name: User['name'];
  email: User['email'];
  locationUser: User['userLocation'];
  gender: User['gender'];
  phone: User['phone'];
  password: User['password'];
};

export interface UserObject {
  _id: User['_id'];
  name: User['name'];
  email: User['email'];
}

export type UserResponseBasedOnUserVerification = {
  user: User;
  emailAlert: boolean;
  token?: string;
  isVerified: boolean;
};
