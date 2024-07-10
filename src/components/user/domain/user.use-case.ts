import { authUserResponse } from '@components/auth/user/data-access/interfaces';
import { ICase } from '@components/case/data-access/interfaces';
import {
  bloodContributionResponse,
  userUseCaseSkeleton,
} from '@components/user/data-access/interfaces';
import {
  ChangePasswordResponse,
  ConfirmResetResponse,
  EditUserProfileResponse,
  IUser,
  IUserModified,
  LogoutUserResponse,
  ResetUserResponse,
  dataForActivateAccount,
  dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
  getUserProfileDataResponse,
} from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { userService } from './user.service';

class userUseCaseClass implements userUseCaseSkeleton {
  //@desc   reset password
  //@route  POST /api/users/reset
  //@access public
  async resetUser(req: Request): Promise<ResetUserResponse> {
    const resetInputsData: dataForResetEmail = { email: req.body.email };
    const responseData = await userService.resetUser(resetInputsData);
    return {
      message: responseData.message,
    };
  }

  // @desc   reset password
  // @route  POST /api/users/confirm
  // @access public
  async confirmReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ConfirmResetResponse> {
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
  }

  //@desc   change password
  //@route  POST /api/users/changepassword
  //@access private
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ChangePasswordResponse> {
    const { password } = req.body;

    const changePasswordInputsData: dataForChangePassword = { password };

    const storedUser: IUser = res.locals.user; // req.app gives you access to the main Express application object.

    //   /** اعتقد الاصل اننا نأتي من الريز أولا لو موجودة نكمل لو مش موجودة نروح للريك  req.app.locals
    //    * res.locals is used for request-specific data that is only relevant to the current request,
    //    *  while req.app.locals is used for storing data that needs to be accessed globally across the entire application
    //    *  and continue throughout the application's lifecycle.
    //    */

    const responseData = await userService.changePassword(changePasswordInputsData, storedUser);

    return {
      message: responseData.message,
    };
  }

  //@desc   activate account email
  //@route  POST /api/users/activate
  //@access private
  async activateAccount(req: Request, res: Response): Promise<authUserResponse> {
    const { token } = req.body;

    const activateAccountInputsData: dataForActivateAccount = { token };

    const storedUser: IUser = res.locals.user;

    const responseData = await userService.activateAccount(
      activateAccountInputsData,
      storedUser,
      res
    );

    return {
      user: responseData.user,
      msg: responseData.msg,
      isVerified: responseData.isVerified,
    };
  }
  //@desc  user blood Contribution
  //@route  Get /api/users/bloodContribution
  //@access private
  async bloodContribution(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<bloodContributionResponse> {
    const storedUser: IUser = res.locals.user;
    const caseId: string | undefined = req.params.id;

    await userService.bloodContribution(req, storedUser, caseId);
    return {
      message: 'an email had been sent to your mail address with detailed info',
    };
  }
  //@desc  user create a fundraising campiagn
  //@route  Post /api/users/bloodContribution
  //@access private
  async requestFundraisingCampaign(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ case: ICase }> {
    const caseData: ICase = req.body;
    const storedUser: IUser = res.locals.user;
    const charityId: string = req.body.charity;

    const responseData = await userService.requestFundraisingCampaign(
      req,
      caseData,
      'none',
      charityId,
      storedUser
    );
    return {
      case: responseData.case,
    };
  }
  //@desc   logout user
  //@route  POST /api/users/logout
  //@access private
  logoutUser(res: Response): LogoutUserResponse {
    const responseData = userService.logoutUser(res);
    return {
      message: responseData.message,
    };
  }
  //@desc   edit user profile
  //@route  POST /api/users/profile/edit
  //@access private
  async editUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<EditUserProfileResponse> {
    const editUserProfileInputsData: IUserModified = req.body;

    const storedUser: IUser = res.locals.user;

    const responseData = await userService.editUserProfile(editUserProfileInputsData, storedUser);

    return {
      user: responseData.user,
      message: responseData.message,
    };
  }

  //@desc   get user profile
  //@route  GET /api/users/profile
  //@access private
  getUserProfileData(req: Request, res: Response, next: NextFunction): getUserProfileDataResponse {
    const storedUser: IUser = res.locals.user;

    const responseData = userService.getUserProfileData(storedUser);

    return {
      user: responseData.user,
      message: responseData.message,
    };
  }
}
export const userUseCase = new userUseCaseClass();
