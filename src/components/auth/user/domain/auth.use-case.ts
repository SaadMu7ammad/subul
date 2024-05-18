import { RequestHandler } from 'express';

import { authUserService } from './auth.service';
// import { UserLocation } from '../../../user/data-access/interfaces/user.interface';
import {
  RegisterUserInputData,
  UserObject,
  UserResponseBasedOnUserVerification,
} from '../data-access/interfaces';
import {
  authUserResponse,
  registerUserResponse,
} from '../data-access/interfaces';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public

const authUser: RequestHandler = async (
  req,
  res,
  _next
): Promise<authUserResponse> => {
  const { email, password }: { email: string; password: string } = req.body;
  const data = { email, password };
  // const data: { email: string; password: string } = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };
  const responseData: UserResponseBasedOnUserVerification =
    await authUserService.authUser(data, res);

  const userResponsed: UserObject = {
    ...responseData.user,
  };

  if (responseData.emailAlert) {
    return {
      user: userResponsed,
      msg: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
      token: responseData.token,
      isVerified: responseData.isVerified,
    };
  } else {
    return {
      user: userResponsed,
      token: responseData.token,
      isVerified: responseData.isVerified,
    };
  }
};
//@desc   submit register page
//@route  POST /api/users/
//@access public

const registerUser: RequestHandler = async (
  req,
  _res,
  _next
): Promise<registerUserResponse> => {
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
