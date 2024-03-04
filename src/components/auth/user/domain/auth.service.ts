import { Response } from 'express';
import { authUserUtils } from './auth.utils';
import generateToken from '../../../../utils/generateToken';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../../utils/mailer';
import { IUserResponse } from '../../../user/data-access/interfaces/user.interface';
import {
  IAuthUserResponse,
  IRegisterData,
  IloginData,
} from '../data-access/auth.interface';
import { BadRequestError } from '../../../../libraries/errors/components';

const authUser = async (
  reqBody: IloginData,
  res: Response
): Promise<IUserResponse> => {
  const { email, password }: { email: string; password: string } = reqBody;
  // if (!email || !password) { 👁️👁️👁️
  //   // return res.status(400).json({ error: 'Email and password are required' });
  //   throw new BadRequestError('Email and password are required');
  // }
  const userResponse = await authUserUtils.checkUserPassword(email, password);

  // const userResponse: UserCheckResult = await authUserUtils.checkUserPassword( 👁️👁️👁️
  //   email,
  //   password
  // );
  // if (!userResponse.user.email || !userResponse.user.name) {👁️👁️👁️
  //   throw new BadRequestError('User registration fields cannot be empty');
  // }

  const token: string = generateToken(res, userResponse.user._id, 'user');

  const userObj: IAuthUserResponse = {
    _id: userResponse.user._id,
    name: userResponse.user.name,
    email: userResponse.user.email,
  };
  // const IsCharityVerified: boolean = authUserUtils.checkUserIsVerified(
  const IsUserVerified: boolean = authUserUtils.checkUserIsVerified(
    userResponse.user
  );
  if (IsUserVerified) {
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

const registerUser = async (
  reqBody: IRegisterData,
  _res: Response
): Promise<{ user: IAuthUserResponse }> => {
  // console.log('reqBody', reqBody);

  const newCreatedUser = await authUserUtils.createUser(reqBody);
  // generateToken(res, newCreatedUser.user._id, 'user');
  if (!newCreatedUser.user.email || !newCreatedUser.user.name) {
    throw new BadRequestError('User registration fields cannot be empty');
  }

  const { firstName, lastName } = newCreatedUser.user.name;
  await setupMailSender(
    newCreatedUser.user.email,
    'welcome alert',
    `hi ${firstName + ' ' + lastName} ` +
      ' we are happy that you joined our community ... keep spreading goodness with us'
  );

  const userObj: IAuthUserResponse = {
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
