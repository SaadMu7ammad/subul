import { Request } from 'express';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
export interface AuthedRequest extends Request {
  user?: IUserDocument;
  charity?: ICharityDocument;
}
export interface AuthResponseData {
  user: Partial<IUserDocument>;
  emailAlert: boolean;
  token?: string;
}
export interface UserCheckResult {
  user: IUserDocument;
  isMatch: boolean;
}
export interface AuthData {
  email: string;
  password: string;
}
export interface RegisterData {
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
export interface UserResponse {
  _id: mongoose.Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
}
export interface IloginData {
  email: string;
  password: string;
}
