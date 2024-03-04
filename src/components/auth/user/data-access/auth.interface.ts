import mongoose from 'mongoose';
import { Request } from 'express';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import { UserLocation } from '../../../user/data-access/interfaces/user.interface';
export interface AuthedRequest extends Request {
  user?: IUserDocument;
  charity?: ICharityDocument;
}
export interface IloginData {
  email: string;
  password: string;
}
// export interface AuthData {
//   email: string;
//   password: string;
// }
export interface AuthedRequest extends Request {
  user?: IUserDocument;
  charity?: ICharityDocument;
}
export interface AuthResponseData {
  user: Partial<IUserDocument>;
  emailAlert: boolean;
  token?: string;
}
export interface IUserCheckResult {
  user: IUserDocument;
  isMatch: boolean;
}
export interface IRegisterData {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  password: string;
  phone: number;
  gender: 'male' | 'female';
  locationUser: UserLocation;
}
export interface IAuthUserResponse {
  _id: mongoose.Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
}
