// import { UserLocation } from '../../../user/data-access/interfaces/user.interface';
import {
  RegisterUserInputData,
  UserResponseBasedOnUserVerification,
} from '@components/auth/user/data-access/interfaces';
import {
  authUserResponse,
  registerUserResponse,
} from '@components/auth/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { authUserUseCaseSkeleton } from '../data-access/interfaces/auth.interfaces';
import { authUserServiceClass } from './auth.service';

export class authUserUseCaseClass implements authUserUseCaseSkeleton {
  authUserServiceInstance: authUserServiceClass;

  constructor() {
    this.authUserServiceInstance = new authUserServiceClass();
  }

  //@desc   submit login page
  //@route  POST /api/users/auth
  //@access public

  async authUser(req: Request, res: Response, _next: NextFunction): Promise<authUserResponse> {
    const { email, password }: { email: string; password: string } = req.body;
    const data = { email, password };

    const responseData = await this.authUserServiceInstance.authUser(data, res, req);
    const userResponsed = responseData.user;

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
  }
  //@desc   submit register page
  //@route  POST /api/users/
  //@access public

  async registerUser(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<registerUserResponse> {
    const { name, email, userLocation, gender, phone, password } = req.body;
    const registerInputsData: RegisterUserInputData = {
      name,
      email,
      userLocation,
      gender,
      phone,
      password,
    };
    const responseData: UserResponseBasedOnUserVerification =
      await this.authUserServiceInstance.registerUser(res, registerInputsData);

    return responseData;
  }
}
// export const authUseCase = {
//   registerUser,
//   authUser,
// };
