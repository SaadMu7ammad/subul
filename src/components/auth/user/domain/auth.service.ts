// import { IUserResponse } from '../../../user/data-access/interfaces/user.interface';
import {
  IloginData,
  RegisterUserInputData,
  UserObject,
  UserResponseBasedOnUserVerification,
} from '@components/auth/user/data-access/interfaces';
import { User } from '@components/user/data-access/interfaces';
import generateToken from '@utils/generateToken';
import { generateResetTokenTemp, setupMailSender } from '@utils/mailer';
import { Response } from 'express';

import { authUserUtils } from './auth.utils';

const authUser = async (
  reqBody: IloginData,
  res: Response
): Promise<UserResponseBasedOnUserVerification> => {
  const { email, password }: { email: string; password: string } = reqBody;

  const userResponse: { isMatch: boolean; user: User } = await authUserUtils.checkUserPassword(
    email,
    password
  );

  const token = generateToken(res, userResponse.user.id, 'user');

  const IsUserVerified: boolean = authUserUtils.checkUserIsVerified(userResponse.user);
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
    await setupMailSender(
      userResponse.user.email,
      'login alert',
      `hi ${
        userResponse.user.name?.firstName + ' ' + userResponse.user.name?.lastName
      } it seems that your account still not verified or activated please go to that link to activate the account ` +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    return {
      user: userResponse.user,
      emailAlert: true,
      isVerified: false,
    };
  }
};

// export interface UserObject {
//   _id: mongoose.Types.ObjectId;
//   name: {
//     firstName: string;
//     lastName: string;
//   };
//   email: string;
// }
const registerUser = async (
  reqBody: RegisterUserInputData
): Promise<{
  user: UserObject;
}> => {
  const newCreatedUser = await authUserUtils.createUser(reqBody);
  // generateToken(res, newCreatedUser.user._id, 'user');
  await setupMailSender(
    newCreatedUser.user.email,
    'welcome alert',
    `hi ${newCreatedUser.user.name?.firstName + ' ' + newCreatedUser.user.name?.lastName} ` +
      ' we are happy that you joined our community ... keep spreading goodness with us'
  );
  const userObj: UserObject = {
    _id: newCreatedUser.user._id,
    name: newCreatedUser.user.name,
    email: newCreatedUser.user.email,
  };
  return {
    user: userObj,
  };
};

export const authUserService = {
  authUser,
  registerUser,
};
