// import {  IUserModifed, IUserResponse, dataForActivateAccount, dataForChangePassword, dataForConfirmResetEmail, dataForResetEmail } from '../data-access/interfaces/user.interface';
import { dataForResetEmail } from '../data-access/interfaces/user.interface';
import { userService } from './user.service';
import { Request, Response } from 'express';
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = async (req: Request): Promise<{ message: string }> => {
  const resetInputsData: dataForResetEmail = req.body;
  const responseData = await userService.resetUser(resetInputsData);
  return {
    message: responseData.message,
  };
};
// //@desc   reset password
// //@route  POST /api/users/confirm
// //@access public
// const confirmReset = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<{ message: string }> => {
//   const resetInputsData:dataForConfirmResetEmail = req.body;
//   const responseData = await userService.confirmReset(resetInputsData);
//   return {
//     message: responseData.message,
//   };
// };

// //@desc   change password
// //@route  POST /api/users/changepassword
// //@access private
// const changePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<{ message: string }> => {
//   const changePasswordInputsData:dataForChangePassword = req.body;
//   const storedUser = res.locals.user;
//   const responseData = await userService.changePassword(
//     changePasswordInputsData,
//     storedUser
//   );
//   return {
//     message: responseData.message,
//   };
// };

// //@desc   activate account email
// //@route  POST /api/users/activate
// //@access private
// const activateAccount = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<{ message: string }> => {
//   const activateAccountInputsData:dataForActivateAccount = req.body;
//   const storedUser = res.locals.user;
//   const responseData = await userService.activateAccount(
//     activateAccountInputsData,
//     storedUser,
//     res
//   );
//   return {
//     message: responseData.message,
//   };
// };
// //@desc   logout user
// //@route  POST /api/users/logout
// //@access private
const logoutUser = (res: Response): { message: string } => {
  const responseData = userService.logoutUser(res);
  return {
    message: responseData.message,
  };
};
// //@desc   edit user profile
// //@route  POST /api/users/profile/edit
// //@access private
// const editUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<IUserResponse> => {
//   const editUserProfileInputsData: IUserModifed = {
//     //for TS
//     name: {
//       firstName: req.body?.name?.firstName,
//       lastName: req.body?.name?.lastName,
//     },
//     email: req.body?.email,
//     locationUser: req.body?.locationUser?.governorate,
//     gender: req.body?.gender,
//     phone: req.body?.phone,
//   };
//   const storedUser = res.locals.user;
//   const responseData = await userService.editUserProfile(
//     editUserProfileInputsData,
//     storedUser
//   );
//   if (responseData.emailAlert) {
//     return {
//       user: responseData.user,
//       message:
//         'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
//     };
//   } else {
//     return {
//       user: responseData.user,
//       message: 'User Data Changed Successfully',
//     };
//   }
// };
// //@desc   get user profile
// //@route  GET /api/users/profile
// //@access private
// const getUserProfileData = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): IUserResponse => {
//   const storedUser = res.locals.user;
//   const responseData = userService.getUserProfileData(storedUser);
//   return {
//     user: responseData.user,
//     message: 'User Profile Fetched Successfully',
//   };
// };

export const userUseCase = {
  logoutUser,
  resetUser,
  //   confirmReset,
  //   changePassword,
  //   activateAccount,
  //   editUserProfile,
  //   getUserProfileData,
};
