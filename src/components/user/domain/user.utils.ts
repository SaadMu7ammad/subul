import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index.js';
import { userRepository } from '../data-access/user.repository';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';
import { Response, Request } from 'express';
import { IUser, IUserResponse } from '../data-access/interfaces/user.interface';
const userRepositoryObj = new userRepository();
const checkUserIsExist = async (email: string): Promise<IUserResponse> => {
  //return user if it exists
  const userIsExist = await userRepositoryObj.findUser(email);
  if (!userIsExist) {
    throw new NotFoundError('email not found Please use another one');
  }
  return {
    user: userIsExist,
  };
};
const logout = (res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
const getUser = (req): Partial<IUserResponse> => {
  return { user: req.user };
};
const checkIsEmailDuplicated = async (email: string): Promise<boolean> => {
  const isDuplicatedEmail = await userRepositoryObj.findUser(email);
  // if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
  return isDuplicatedEmail ? true : false;
};
const changeUserEmailWithMailAlert = async (
  UserBeforeUpdate: IUser,
  newEmail: string
): Promise<IUserResponse> => {
  //for sending email if changed or edited
  UserBeforeUpdate.email = newEmail;
  UserBeforeUpdate.emailVerification.isVerified = false;
  UserBeforeUpdate.emailVerification.verificationDate = undefined;
  const token = await generateResetTokenTemp();
  UserBeforeUpdate.verificationCode = token;
  await setupMailSender(
    UserBeforeUpdate.email,
    'email changed alert',
    `hi ${
      UserBeforeUpdate?.name?.firstName + ' ' + UserBeforeUpdate?.name?.lastName
    }email has been changed You must Re activate account ` +
      `<h3>(www.activate.com)</h3>` +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  await UserBeforeUpdate.save();
  return { user: UserBeforeUpdate };
};
const verifyUserAccount = async (user) => {
  user.verificationCode = null;
  user.emailVerification.isVerified = true;
  user.emailVerification.verificationDate = Date.now();
  user = await user.save();
};
const resetSentToken = async (user) => {
  user.verificationCode = null;
  user = await user.save();
};
export const userUtils = {
  checkUserIsExist,
  logout,
  getUser,
  checkIsEmailDuplicated,
  verifyUserAccount,
  resetSentToken,
  changeUserEmailWithMailAlert,
};
