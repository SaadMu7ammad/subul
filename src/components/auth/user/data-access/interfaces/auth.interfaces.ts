import { IUser } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { authUserResponse, registerUserResponse } from './auth.api';
import {
  IloginData,
  RegisterUserInputData,
  UserObject,
  UserResponseBasedOnUserVerification,
} from './auth.user';

export interface authUserServiceSkeleton {
  authUser(reqBody: IloginData, res: Response): Promise<UserResponseBasedOnUserVerification>;
  registerUser(reqBody: RegisterUserInputData): Promise<{
    user: UserObject;
  }>;
}

export interface authUserUseCaseSkeleton {
  authUser(req: Request, res: Response, _next: NextFunction): Promise<authUserResponse>;

  registerUser(req: Request, res: Response, _next: NextFunction): Promise<registerUserResponse>;
}

export interface authUserUtilsSkeleton {
  checkUserPassword(email: string, password: string): Promise<{ isMatch: boolean; user: IUser }>;

  checkUserIsVerified(user: IUser): boolean;

  createUser(dataInputs: RegisterUserInputData): Promise<{ user: IUser }>;
}
