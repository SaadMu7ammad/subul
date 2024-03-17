import { authUserUtils } from './auth.utils';
import generateToken from '../../../../utils/generateToken';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../../utils/mailer';
import {
  IUserDocument,
  IUserResponse,
} from '../../../user/data-access/interfaces/user.interface';
import { Response } from 'express';
import { IloginData } from '../data-access/auth.interface';
import { RegisterUSerInputData } from './auth.use-case';
import mongoose from 'mongoose';

const authUser = async (
  reqBody: IloginData,
  res: Response
): Promise<IUserResponse> => {
  const { email, password }: { email: string; password: string } = reqBody;
  const userResponse = await authUserUtils.checkUserPassword(email, password);
  const token: string = generateToken(res, userResponse.user._id, 'user');
  const userObj: Partial<IUserDocument> = {
    _id: userResponse.user._id,
    name: userResponse.user.name,
    email: userResponse.user.email,
  };
  const IsCharityVerified: boolean = authUserUtils.checkUserIsVerified(
    userResponse.user
  );
  if (IsCharityVerified) {
    return {
      user: userObj,
      emailAlert: false,
      token: token,
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
        userResponse.user.name.firstName + ' ' + userResponse.user.name.lastName
      } it seems that your account still not verified or activated please go to that link to activate the account ` +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    return {
      user: userObj,
      emailAlert: true,
    };
  }
};

export interface UserObject {
  _id: mongoose.Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
}
const registerUser = async (
  reqBody: RegisterUSerInputData,
  _res: Response
): Promise<{
  user: UserObject;
}> => {
  const newCreatedUser = await authUserUtils.createUser(reqBody);
  // generateToken(res, newCreatedUser.user._id, 'user');
  await setupMailSender(
    newCreatedUser.user.email,
    'welcome alert',
    `hi ${
      newCreatedUser.user.name.firstName +
      ' ' +
      newCreatedUser.user.name.lastName
    } ` +
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
