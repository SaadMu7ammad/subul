import { userUtils } from './user.utils.js';
import { Response } from 'express';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';
import {
  BadRequestError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index.js';
import {
  checkValueEquality,
  updateNestedProperties,
} from '../../../utils/shared.js';
import {
  IUser,
  IUserResponse,
  dataForActivateAccount,
  dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
} from '../data-access/interfaces/user.interface.js';
const resetUser = async (reqBody: dataForResetEmail) => {
  const email = reqBody.email;
  //   if (!email) throw new BadRequestError('no email input');
  const userResponse = await userUtils.checkUserIsExist(email);
  const token = await generateResetTokenTemp();
  userResponse.user.verificationCode = token;
  await userResponse.user.save();
  await setupMailSender(
    userResponse.user.email,
    'reset alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  return {
    message: 'email sent successfully to reset the password',
  };
};
const confirmReset = async (reqBody: dataForConfirmResetEmail) => {
  let updatedUser: IUserResponse = await userUtils.checkUserIsExist(
    reqBody.email
  );
  const isEqual = checkValueEquality(
    updatedUser.user.verificationCode,
    reqBody.token
  );
  if (!isEqual) {
    updatedUser.user.verificationCode = undefined;
    await updatedUser.user.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  updatedUser.user.password = reqBody.password;
  updatedUser.user.verificationCode = null as unknown as string | undefined;
  await updatedUser.user.save();
  await setupMailSender(
    updatedUser.user.email,
    'password changed alert',
    `hi ${
      updatedUser.user.name?.firstName + ' ' + updatedUser.user.name?.lastName
    } <h3>contact us if you did not changed the password</h3>` +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  return { message: 'user password changed successfully' };
};
const changePassword = async (reqBody: dataForChangePassword, user: IUser) => {
  let updatedUser = user;
  updatedUser.password = reqBody.password;
  await updatedUser.save();
  await setupMailSender(
    updatedUser.email,
    'password changed alert',
    `hi ${
      updatedUser.name.firstName + ' ' + updatedUser.name.lastName
    }<h3>contact us if you did not changed the password</h3>` +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );
  return { message: 'user password changed successfully' };
};
const activateAccount = async (
  reqBody: dataForActivateAccount,
  user: IUser,
  res: Response
) => {
  let storedUser = user;
  if (storedUser.emailVerification.isVerified) {
    return { message: 'account already is activated' };
  }
  const isMatch = checkValueEquality(
    storedUser.verificationCode,
    reqBody.token
  );
  if (!isMatch) {
    await userUtils.resetSentToken(storedUser);
    userUtils.logout(res);
    throw new UnauthenticatedError('invalid token you have been logged out');
  }
  await userUtils.verifyUserAccount(storedUser);
  await setupMailSender(
    storedUser.email,
    'account has been activated ',
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  return {
    message: 'account has been activated successfully',
  };
};
const logoutUser = (res) => {
  userUtils.logout(res);
  return { message: 'logout' };
};
const getUserProfileData = (user: IUser) => {
  return { user: user };
};
const editUserProfile = async (
  reqBody: Partial<IUser>,
  user: IUser
): Promise<IUserResponse> => {
  // const updateUserArgs = dot.dot(req.body);
  if (!reqBody) throw new BadRequestError('no data sent');
  if (
    //put restriction  on the edit elements
    !reqBody.name &&
    !reqBody.email &&
    !reqBody.locationUser &&
    !reqBody.gender &&
    !reqBody.phone
  )
    throw new BadRequestError('cant edit that');

  let { email = undefined } = { ...reqBody };
  if (email) {
    //if the edit for email
    // const alreadyRegisteredEmail = await User.findOne({ email });
    const isDupliacated = await userUtils.checkIsEmailDuplicated(email);
    if (isDupliacated) throw new BadRequestError('Email is already taken!');
    const userWithEmailUpdated = await userUtils.changeUserEmailWithMailAlert(
      user,
      email
    ); //email is the NewEmail
    const userObj: Partial<IUser> = {
      name: userWithEmailUpdated?.user?.name,
      email: userWithEmailUpdated?.user?.email,
      locationUser: userWithEmailUpdated?.user?.locationUser,
      gender: userWithEmailUpdated?.user?.gender,
      phone: userWithEmailUpdated?.user?.phone,
    };
    return {
      emailEdited: true,
      user: <IUser>userObj,
    };
  }
  updateNestedProperties(user, reqBody);
  await user.save();
  const userObj: Partial<IUser> = {
    name: user.name,
    email: user.email,
    locationUser: user.locationUser, //.governorate,
    gender: user.gender,
    phone: user.phone,
  };
  return {
    emailEdited: false,
    user: <IUser>userObj,
  };
};
export const userService = {
  resetUser,
  confirmReset,
  changePassword,
  activateAccount,
  logoutUser,
  getUserProfileData,
  editUserProfile,
};
