import {
  EditUserProfileResponse,
  IUserModified,
  ResetUserResponse,
  dataForActivateAccount,
  dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
  ConfirmResetResponse,
  ChangePasswordResponse,
  ActivateAccountResponse,
  LogoutUserResponse,
  getUserProfileDataResponse,
  User,
} from '../data-access/interfaces';
import { userService } from './user.service';
import { NextFunction, Request, Response } from 'express';

//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = async (req: Request): Promise<ResetUserResponse> => {
  const resetInputsData: dataForResetEmail = { email: req.body.email };
  const responseData = await userService.resetUser(resetInputsData);
  return {
    message: responseData.message,
  };
};

// @desc   reset password
// @route  POST /api/users/confirm
// @access public
const confirmReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ConfirmResetResponse> => {
  const { email, token, password } = req.body;

  const resetInputsData: dataForConfirmResetEmail = {
    email,
    token,
    password,
  };

  const responseData = await userService.confirmReset(resetInputsData);

  return {
    message: responseData.message,
  };
};

//@desc   change password
//@route  POST /api/users/changepassword
//@access private
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ChangePasswordResponse> => {
  const { password } = req.body;

  const changePasswordInputsData: dataForChangePassword = { password };

  const storedUser: User = res.locals.user; // req.app gives you access to the main Express application object.

  //   /** اعتقد الاصل اننا نأتي من الريز أولا لو موجودة نكمل لو مش موجودة نروح للريك => req.app.locals
  //    * res.locals is used for request-specific data that is only relevant to the current request,
  //    *  while req.app.locals is used for storing data that needs to be accessed globally across the entire application
  //    *  and continue throughout the application's lifecycle.
  //    */

  const responseData = await userService.changePassword(
    changePasswordInputsData,
    storedUser
  );

  return {
    message: responseData.message,
  };
};

//@desc   activate account email
//@route  POST /api/users/activate
//@access private
const activateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ActivateAccountResponse> => {
  const { token } = req.body;

  const activateAccountInputsData: dataForActivateAccount = { token };
  
  const storedUser: User = res.locals.user;
  
  const responseData = await userService.activateAccount(
    activateAccountInputsData,
    storedUser,
    res
  );

  return {
    message: responseData.message,
  };
};

//@desc   logout user
//@route  POST /api/users/logout
//@access private
const logoutUser = (res: Response): LogoutUserResponse => {
  const responseData = userService.logoutUser(res);
  return {
    message: responseData.message,
  };
};
//@desc   edit user profile
//@route  POST /api/users/profile/edit
//@access private
const editUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<EditUserProfileResponse> => {

  const editUserProfileInputsData: IUserModified = req.body;

  //❌ Code below causes an error: `Cannot read prop of undefined`
  // const editUserProfileInputsData: IUserModifed = {
  //   //for TS
  //   name: {
  //     firstName: req.body.name.firstName,
  //     lastName: req.body.name.lastName,
  //   },
  //   email: req.body.email,
  //   userLocation: req.body.userLocation.governorate,
  //   gender: req.body.gender,
  //   phone: req.body.phone,
  // };

  const storedUser: User = res.locals.user;

  const responseData = await userService.editUserProfile(
    editUserProfileInputsData,
    storedUser
  );

  return {
    user: responseData.user,
    message: responseData.message,
  };
};

//@desc   get user profile
//@route  GET /api/users/profile
//@access private
const getUserProfileData = (
  req: Request,
  res: Response,
  next: NextFunction
): getUserProfileDataResponse => {
  const storedUser: User = res.locals.user;

  const responseData = userService.getUserProfileData(storedUser);

  return {
    user: responseData.user,
    message: responseData.message,
  };
};

export const userUseCase = {
  logoutUser,
  resetUser,
  confirmReset,
  changePassword,
  activateAccount,
  editUserProfile,
  getUserProfileData,
};
