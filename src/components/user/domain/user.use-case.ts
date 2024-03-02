import { AuthedRequest } from '../../auth/user/data-access/auth.interface';
import { IUserResponse } from '../data-access/interfaces/user.interface';
import { userService } from './user.service';
import { Request, Response, NextFunction } from 'express';
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = async (req: Request, res: Response, next: NextFunction) => {
  const resetInputsData = req.body;
  const responseData = await userService.resetUser(resetInputsData);
  return {
    message: responseData.message,
  };
};
//@desc   reset password
//@route  POST /api/users/confirm
//@access public
const confirmReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resetInputsData = req.body;
  const responseData = await userService.confirmReset(resetInputsData);
  return {
    message: responseData.message,
  };
};

//@desc   change password
//@route  POST /api/users/changepassword
//@access private
const changePassword = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const changePasswordInputsData = req.body;
  const storedUser = req.user;
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
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const activateAccountInputsData = req.body;
  const storedUser = req.user;
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
const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  const responseData = userService.logoutUser(res);
  return {
    message: responseData.message,
  };
};
//@desc   edit user profile
//@route  POST /api/users/profile/edit
//@access private
const editUserProfile = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<IUserResponse> => {
  const userObj = {
    //for TS
    name: {
      firstName: req.body?.name?.firstName,
      lastName: req.body?.name?.lastName,
    },
    email: req.body?.email,
    location: req.body?.location?.governorate,
    gender: req.body?.gender,
    phone: req.body?.phone,
  };
  const editUserProfileInputsData = userObj;
  // const editUserProfileInputsData: Partial<IUser> = req.body;
  const storedUser = req.user;
  const responseData = await userService.editUserProfile(
    editUserProfileInputsData,
    storedUser
  );
  if (responseData.emailEdited) {
    return {
      user: responseData.user,
      message:
        'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
    };
  } else {
    return {
      user: responseData.user,
      message: 'User Data Changed Successfully',
    };
  }
};
//@desc   get user profile
//@route  GET /api/users/profile
//@access private
const getUserProfileData = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const storedUser = req.user;
  const responseData = userService.getUserProfileData(storedUser);
  return {
    user: responseData.user,
    message: 'User Profile Fetched Successfully',
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
