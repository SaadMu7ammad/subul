import { RequestHandler } from 'express';

import { UserObject, authUserService } from './auth.service';
// import { UserLocation } from '../../../user/data-access/interfaces/user.interface';
import { User } from '../../../user/data-access/models/user.model';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public

type UserResponseBasedOnEmailAlert = {
  user: UserObject;
  msg?: string;
  token?: string; // must be optional cuz it comes from responseData as optional
};

const authUser: RequestHandler = async (
  req,
  res,
  _next
): Promise<UserResponseBasedOnEmailAlert> => {
  const { email, password }: { email: string; password: string } = req.body;
  const data = { email, password };
  // const data: { email: string; password: string } = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };
  const responseData = await authUserService.authUser(data, res);

  const userResponsed: UserObject = {
    ...responseData.user,
  };

  if (responseData.emailAlert) {
    return {
      user: userResponsed,
      msg: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
      token: responseData.token,
    };
  } else {
    return {
      user: userResponsed,
      token: responseData.token,
    };
  }
};
//@desc   submit register page
//@route  POST /api/users/
//@access public

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

const registerUser: RequestHandler = async (
  req,
  res,
  _next
): Promise<{ user: UserObject }> => {
  const registerInputsData: RegisterUserInputData = req.body;

  const responseData = await authUserService.registerUser(registerInputsData);

  const userResponsed: UserObject = {
    ...responseData.user,
  };

  return { user: userResponsed };
};
export const authUseCase = {
  registerUser,
  authUser,
};
