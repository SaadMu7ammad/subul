import { RequestHandler } from 'express';

import { UserObject, authUserService } from './auth.service';
import { UserLocation } from '../../../user/data-access/interfaces/user.interface';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public
const authUser: RequestHandler = async (req, res, next) => {
  const data: { email: string; password: string } = {
    email: req.body.email,
    password: req.body.password,
  };
  const responseData = await authUserService.authUser(data, res);
  const userResponsed = {
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

export interface RegisterUSerInputData {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  locationUser: UserLocation;
  gender: 'male' | 'female';
  phone: string;
  password: string;
}

const registerUser: RequestHandler = async (
  req,
  res,
  _next
): Promise<{ user: UserObject }> => {
  const registerInputsData: RegisterUSerInputData = req.body;

  const responseData = await authUserService.registerUser(
    registerInputsData,
    res
  );

  const userResponsed: UserObject = {
    ...responseData.user,
  };

  return { user: userResponsed };
};
export const authUseCase = {
  registerUser,
  authUser,
};
