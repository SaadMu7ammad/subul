import { Response } from 'express';
import { authUserUtils } from './auth.utils.js';
import generateToken from '../../../../utils/generateToken.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../../utils/mailer.js';
import { IUser } from '../../../user/data-access/interfaces/user.interface.js';
import { UserCheckResult } from '../data-access/auth.interface.js';
import { AuthResponseData } from '../data-access/auth.interface.js';
import { AuthData } from '../data-access/auth.interface.js';
import { RegisterData } from '../data-access/auth.interface.js';
import { UserResponse } from '../data-access/auth.interface.js';
import { BadRequestError } from '../../../../libraries/errors/components/index.js';

const authUser = async (
  reqBody: AuthData,
  res: Response
): Promise<AuthResponseData> => {
  // const { email, password }: { email: string; password: string } = reqBody;
  const { email, password } = reqBody;

  if (!email || !password) {
    // return res.status(400).json({ error: 'Email and password are required' });
    throw new BadRequestError('Email and password are required');
  }

  // All user & bool value👇
  const userResponse: UserCheckResult = await authUserUtils.checkUserPassword(
    email,
    password
  );

  if (!userResponse.user.email || !userResponse.user.name) {
    throw new BadRequestError('User registration fields cannot be empty');
  }

  const token: string = generateToken(res, userResponse.user._id, 'user');

  const userObj: UserResponse = {
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
  reqBody: RegisterData,
  _res: Response
): Promise<{ user: UserResponse }> => {
  console.log('reqBody', reqBody);

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
  const userObj: UserResponse = {
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
