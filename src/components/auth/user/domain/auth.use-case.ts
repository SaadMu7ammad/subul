import { authUserService } from './auth.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { IUser } from '../../../user/data-access/interfaces/user.interface.js';
import { AuthResponseData } from '../data-access/auth.interface.js';
import { AuthedRequest } from '../data-access/auth.interface.js';
import { AuthData } from '../data-access/auth.interface.js';
import { UserResponse } from '../data-access/auth.interface.js';

//@desc   submit login page
//@route  POST /api/users/auth
//@access public
// interface AuthResponseData {
//   user: Partial<IUser>;
//   emailAlert: boolean;
//   token?: string;
// }

const authUser = async (
  req: AuthedRequest,
  res: Response,
  _next: NextFunction
) => {
  // const data: { email: string; password: string } = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };
  const data: AuthData = {
    email: req.body.email,
    password: req.body.password,
  };

  const responseData = (await authUserService.authUser(
    data,
    res
  )) as AuthResponseData; // explicitly typing the responseData variable when calling the authUser

  // const userResponsed: Partial<IUser> = responseData.user;
  const userResponsed: Partial<IUser> = {
    ...responseData.user,
  };
  // console.log('userResponsed', userResponsed); => { _id, name, email }

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
const registerUser = async (
  req: AuthedRequest,
  res: Response,
  _next: NextFunction
): Promise<{ user: UserResponse }> => {
  const registerInputsData = req.body;

  const responseData = await authUserService.registerUser(
    registerInputsData,
    res
  );
  const userResponsed: UserResponse = {
    ...responseData.user,
  };
  // console.log('userResponsed', userResponsed);
  // const userResponsed: Partial<IUser> = {
  //   ...responseData.user,
  // };

  return { user: userResponsed };
};

export const authUseCase = {
  registerUser,
  authUser,
};
