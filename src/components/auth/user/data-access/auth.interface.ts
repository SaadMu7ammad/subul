import { User } from '../../../user/data-access/models/user.model';
// import { Request } from 'express';
// import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
// import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
// export interface AuthedRequest extends Request {
//     user: IUserDocument;
//     charity: ICharityDocument;

export interface IloginData {
  email: User['email'];
  password: User['password'];
}

// Define RegisterUserInputData based on the structure of the User type
export type RegisterUserInputData = {
  name: User['name'];
  email: User['email'];
  locationUser: User['locationUser'];
  gender: User['gender'];
  phone: User['phone'];
  password: User['password'];
};
// export type RegisterUSerInputData = {
//   name: {
//     firstName: string;
//     lastName: string;
//   };
//   email: string;
//   locationUser: locationUser;
//   gender: 'male' | 'female';
//   phone: string;
//   password: string;
// };
export type UserResponseBasedOnEmailAlert = {
  user: UserObject;
  msg?: string;
  token?: string; // must be optional cuz it comes from responseData as optional
};

export interface UserObject {
  _id: User['_id'];
  name: User['name'];
  email: User['email'];
}

export type UserResponseBasedOnUserVerification = {
  user: UserObject;
  emailAlert: boolean;
  token?: string;
};
