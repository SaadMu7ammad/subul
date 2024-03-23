import { userUtils } from './user.utils';
import { Response } from 'express';
import { generateResetTokenTemp, setupMailSender } from '../../../utils/mailer';
import {
  //   BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index';
import {
  checkValueEquality,
  // updateNestedProperties,
} from '../../../utils/shared';
import {
  //   IUserDocument,
  //   IUserModifed,
  //   IUserResponse,
  //   dataForActivateAccount,
  //   dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
} from '../data-access/interfaces/user.interface';
import { User } from '../data-access/models/user.model';
import { HydratedDocument } from 'mongoose';

const resetUser = async (reqBody: dataForResetEmail) => {
  const email = reqBody.email;
  //   if (!email) throw new BadRequestError('no email input');
  const userResponse: { user: HydratedDocument<User> } =
    await userUtils.checkUserIsExist(email);
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
  let updatedUser: { user: HydratedDocument<User> } =
    await userUtils.checkUserIsExist(reqBody.email);
  // { user: { } }

  if (!updatedUser.user.verificationCode)
    throw new NotFoundError('code not exist');

  const isEqual = checkValueEquality(
    updatedUser.user.verificationCode,
    reqBody.token
  );

  if (!isEqual) {
    updatedUser.user.verificationCode = '';
    await updatedUser.user.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }

  updatedUser.user.password = reqBody.password;
  updatedUser.user.verificationCode = '';
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

// const changePassword = async (
//   reqBody: dataForChangePassword,
//   user: IUserDocument
// ) => {
//   let updatedUser = user;
//   updatedUser.password = reqBody.password;
//   await updatedUser.save();
//   await setupMailSender(
//     updatedUser.email,
//     'password changed alert',
//     `hi ${
//       updatedUser.name.firstName + ' ' + updatedUser.name.lastName
//     }<h3>contact us if you did not changed the password</h3>` +
//       `<h3>go to link(www.dummy.com) to freeze your account</h3>`
//   );
//   return { message: 'user password changed successfully' };
// };
// const activateAccount = async (
//   reqBody: dataForActivateAccount,
//   user: IUserDocument,
//   res: Response
// ) => {
//   let storedUser = user;
//   if (storedUser.emailVerification.isVerified) {
//     return { message: 'account already is activated' };
//   }
//   if(!storedUser.verificationCode)throw new NotFoundError('verificationCode not found')
//   const isMatch = checkValueEquality(
//     storedUser.verificationCode,
//     reqBody.token
//   );
//   if (!isMatch) {
//     await userUtils.resetSentToken(storedUser);
//     userUtils.logout(res);
//     throw new UnauthenticatedError('invalid token you have been logged out');
//   }
//   await userUtils.verifyUserAccount(storedUser);
//   await setupMailSender(
//     storedUser.email,
//     'account has been activated ',
//     `<h2>now you are ready to spread the goodness with us </h2>`
//   );

//   return {
//     message: 'account has been activated successfully',
//   };
// };
const logoutUser = (res: Response): { message: string } => {
  userUtils.logout(res);
  return { message: 'logout' };
};
// const getUserProfileData = (user: IUserDocument):{user:IUserDocument} => {
//   return { user: user };
// };
// const editUserProfile = async (
//   reqBody: IUserModifed,
//   user: IUserDocument
// ): Promise<IUserResponse> => {
//   if (!reqBody) throw new BadRequestError('no data sent');
//   if (
//     //put restriction  on the edit elements
//     !reqBody.name &&
//     !reqBody.email &&
//     !reqBody.locationUser &&
//     !reqBody.gender &&
//     !reqBody.phone
//   )
//     throw new BadRequestError('cant edit that');

//   const { email = undefined } = { ...reqBody };
//   if (email) {
//     //if the edit for email
//     // const alreadyRegisteredEmail = await User.findOne({ email });
//     const isDupliacated = await userUtils.checkIsEmailDuplicated(email);
//     if (isDupliacated) throw new BadRequestError('Email is already taken!');
//     const userWithEmailUpdated = await userUtils.changeUserEmailWithMailAlert(
//       user,
//       email
//     ); //email is the NewEmail
//     const userObj: Partial<IUserDocument> = {
//       name: userWithEmailUpdated.user.name,
//       email: userWithEmailUpdated.user.email,
//       locationUser: userWithEmailUpdated.user.locationUser,
//       gender: userWithEmailUpdated.user.gender,
//       phone: userWithEmailUpdated.user.phone,
//     };
//     return {
//       emailAlert: true,
//       user: userObj,
//     };
//   }
//   updateNestedProperties(user, reqBody);
//   await user.save();
//   const userObj: Partial<IUserDocument> = {
//     name: user.name,
//     email: user.email,
//     locationUser: user.locationUser, //.governorate,
//     gender: user.gender,
//     phone: user.phone,
//   };
//   return {
//     emailAlert: false,
//     user:userObj,
//   };
// };
export const userService = {
  resetUser,
  confirmReset,
  //   changePassword,
  //   activateAccount,
  logoutUser,
  //   getUserProfileData,
  //   editUserProfile,
};
