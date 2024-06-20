import { authUserResponse } from '@components/auth/user/data-access/interfaces';
import { ICase } from '@components/case/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import {
  ChangePasswordResponse,
  ConfirmResetResponse,
  EditProfile,
  EditUserProfileResponse,
  IUser,
  IUserModified,
  LogoutUserResponse,
  ResetUserResponse,
  bloodContributionResponse,
  dataForActivateAccount,
  dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
  getUserProfileDataResponse,
} from '.';

// import { IUser, IUserDocument } from './user.interface';

export interface UserDao {
  findUser(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  createUser(dataInputs: IUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
}
export interface UserServiceDao {
  resetUser(reqBody: dataForResetEmail): Promise<{
    message: string;
  }>;

  confirmReset(reqBody: dataForConfirmResetEmail): Promise<{
    message: string;
  }>;

  changePassword(
    reqBody: dataForChangePassword,
    user: IUser
  ): Promise<{
    message: string;
  }>;

  activateAccount(
    reqBody: dataForActivateAccount,
    user: IUser,
    res: Response
  ): Promise<authUserResponse>;

  bloodContribution(user: IUser, id: string | undefined): Promise<void>;

  requestFundraisingCampaign(
    caseData: ICase,
    image: string,
    charityId: string,
    storedUser: IUser
  ): Promise<{ case: ICase }>;

  logoutUser(res: Response): void;

  getUserProfileData(user: IUser): { user: IUser };

  editUserProfile(reqBody: IUserModified, user: IUser): Promise<EditProfile>;
}

export interface userUseCaseDao {
  resetUser(req: Request): Promise<ResetUserResponse>;

  confirmReset(req: Request, res: Response, next: NextFunction): Promise<ConfirmResetResponse>;

  changePassword(req: Request, res: Response, next: NextFunction): Promise<ChangePasswordResponse>;

  activateAccount(req: Request, res: Response): Promise<authUserResponse>;
  bloodContribution(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<bloodContributionResponse>;

  requestFundraisingCampaign(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ case: ICase }>;
  logoutUser(res: Response): LogoutUserResponse;
  editUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<EditUserProfileResponse>;

  getUserProfileData(req: Request, res: Response, next: NextFunction): getUserProfileDataResponse;
}

export interface userUtilsDao {
  checkUserIsExist(email: string): Promise<{ user: IUser }>;
  checkUserIsExistById(id: string): Promise<{ user: IUser }>;
  logout(res: Response): void;
  checkIsEmailDuplicated(email: string): Promise<boolean>;

  changeUserEmailWithMailAlert(UserBeforeUpdate: IUser, newEmail: string): Promise<{ user: IUser }>;
  verifyUserAccount(user: IUser): Promise<void>;
  checkIfCaseBelongsToUserContributions(
    userContributionsArray: IUser['_id'][],
    caseId: string
  ): number;
  deleteCaseFromUserContributionsArray(user: IUser, idx: number): Promise<void>;
  resetSentToken(user: IUser): Promise<void>;
}
