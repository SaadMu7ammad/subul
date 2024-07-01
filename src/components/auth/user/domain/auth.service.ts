// import { IUserResponse } from '../../../user/data-access/interfaces/user.interface';
import {
  IloginData,
  RegisterUserInputData,
  UserObject,
  UserResponseBasedOnUserVerification,
} from '@components/auth/user/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import generateToken from '@utils/generateToken';
import { generateResetTokenTemp, sendActivationEmail, setupMailSender } from '@utils/mailer';
import { Response } from 'express';

import logger from '../../../../utils/logger';
import { authUserServiceSkeleton } from '../data-access/interfaces/auth.interfaces';
import { authUserUtilsClass } from './auth.utils';

export class authUserServiceClass implements authUserServiceSkeleton {
  authUserUtilsInstance: authUserUtilsClass;

  constructor() {
    this.authUserUtilsInstance = new authUserUtilsClass();
  }
  async authUser(reqBody: IloginData, res: Response): Promise<UserResponseBasedOnUserVerification> {
    const { email, password }: { email: string; password: string } = reqBody;

    const userResponse: { isMatch: boolean; user: IUser } =
      await this.authUserUtilsInstance.checkUserPassword(email, password);

    const token = generateToken(res, userResponse.user.id, 'user');

    const IsUserVerified: boolean = this.authUserUtilsInstance.checkUserIsVerified(
      userResponse.user
    );
    if (IsUserVerified) {
      return {
        user: userResponse.user,
        emailAlert: false,
        token: token,
        isVerified: true,
      };
    } else {
      //not verified(not activated)
      const token: string = await generateResetTokenTemp();
      userResponse.user.verificationCode = token;
      await userResponse.user.save();
      await sendActivationEmail(userResponse.user.email, token);
      return {
        user: userResponse.user,
        emailAlert: true,
        isVerified: false,
      };
    }
  }

  // export interface UserObject {
  //   _id: mongoose.Types.ObjectId;
  //   name: {
  //     firstName: string;
  //     lastName: string;
  //   };
  //   email: string;
  // }
  async registerUser(reqBody: RegisterUserInputData): Promise<{
    user: UserObject;
  }> {
    const newCreatedUser = await this.authUserUtilsInstance.createUser(reqBody);
    // generateToken(res, newCreatedUser.user._id, 'user');
    try {
      await setupMailSender(
        newCreatedUser.user.email,
        'Welcome Alert',
        `hi ${newCreatedUser.user.name?.firstName + ' ' + newCreatedUser.user.name?.lastName} ` +
          ' we are happy that you joined our community ... keep spreading goodness with us'
      );
    } catch (err) {
      logger.warn('error happened while sending welcome email');
    }
    const userObj: UserObject = {
      _id: newCreatedUser.user._id,
      name: newCreatedUser.user.name,
      email: newCreatedUser.user.email,
    };
    return {
      user: userObj,
    };
  }
}
// export const authUserService = {
//   authUser,
//   registerUser,
// };
