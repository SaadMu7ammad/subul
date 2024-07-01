import { authUserResponse } from '@components/auth/user/data-access/interfaces';
import { ICase } from '@components/case/data-access/interfaces';
import { caseService } from '@components/case/domain/case.service';
import { caseUtils } from '@components/case/domain/case.utils';
import { CharityRepository } from '@components/charity/data-access/charity.repository';
import { ICharity } from '@components/charity/data-access/interfaces';
import {
  EditProfile,
  IUserModified,
  User,
  dataForActivateAccount,
  dataForChangePassword,
  dataForConfirmResetEmail,
  dataForResetEmail,
} from '@components/user/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import { generateResetTokenTemp, sendResetPasswordEmail, setupMailSender } from '@utils/mailer';
import { sendNotification } from '@utils/sendNotification';
import { checkValueEquality, updateNestedProperties } from '@utils/shared';
import { Response } from 'express';

import { userUtils } from './user.utils';

const resetUser = async (reqBody: dataForResetEmail) => {
  const email = reqBody.email;
  //   if (!email) throw new BadRequestError('no email input');
  const userResponse = await userUtils.checkUserIsExist(email);
  const token = await generateResetTokenTemp();
  userResponse.user.verificationCode = token;
  await userResponse.user.save();
  await sendResetPasswordEmail(userResponse.user.email, token);
  return {
    message: 'email sent successfully to reset the password',
  };
};

const confirmReset = async (reqBody: dataForConfirmResetEmail) => {
  const updatedUser = await userUtils.checkUserIsExist(reqBody.email);
  // { user: { } }

  if (!updatedUser.user.verificationCode) throw new NotFoundError('code not exist');

  const isEqual = checkValueEquality(updatedUser.user.verificationCode, reqBody.token);

  if (!isEqual) {
    updatedUser.user.verificationCode = '';
    await updatedUser.user.save();
    throw new UnauthenticatedError('invalid token send request again to reset a password');
  }

  updatedUser.user.password = reqBody.password;
  updatedUser.user.verificationCode = '';
  await updatedUser.user.save();

  await setupMailSender(
    updatedUser.user.email,
    'Password Changed',
    `hi ${updatedUser.user.name.firstName} contact us if you did not changed the password or you can freeze your account`
  );

  return { message: 'user password changed successfully' };
};

const changePassword = async (reqBody: dataForChangePassword, user: User) => {
  const updatedUser = user;
  updatedUser.password = reqBody.password;
  await updatedUser.save();
  await setupMailSender(
    updatedUser.email,
    'Password Changed',
    `hi ${updatedUser.name.firstName} contact us if you did not changed the password or you can freeze your account`
  );

  return { message: 'user password changed successfully' };
};

const activateAccount = async (
  reqBody: dataForActivateAccount,
  user: User,
  res: Response
): Promise<authUserResponse> => {
  const storedUser = user;
  if (storedUser.emailVerification?.isVerified) {
    return {
      // message: 'account already is activated'
      user: storedUser,
      msg: 'account already is activated',
      isVerified: true,
    };
  }
  if (!storedUser.verificationCode) throw new NotFoundError('verificationCode not found');
  const isMatch = checkValueEquality(storedUser.verificationCode, reqBody.token);
  if (!isMatch) {
    await userUtils.resetSentToken(storedUser);
    userUtils.logout(res);
    throw new UnauthenticatedError('invalid token you have been logged out');
  }
  await userUtils.verifyUserAccount(storedUser);
  await setupMailSender(
    storedUser.email,
    'Account Activated ',
    `now you are ready to spread the goodness with us`
  );

  return {
    // message: 'account has been activated successfully',
    user: storedUser,
    msg: 'account has been activated successfully',
    isVerified: true,
  };
};
//we must limit the amount of sending emails as each time user click to contribute to the same case will send an email to him
//we store nothing in the db
const bloodContribution = async (user: User, id: string | undefined) => {
  if (!id) throw new BadRequestError('no id provided');
  const isCaseExist = await caseUtils.getCaseByIdFromDB(id);

  if (!isCaseExist.privateNumber) throw new BadRequestError('sorry no number is added');
  if (isCaseExist.finished) throw new BadRequestError('the case had been finished');

  await setupMailSender(
    user.email,
    'Blood Contribution',
    'thanks for your caring' +
      `here is the number to get contact with the case immediate,${isCaseExist.privateNumber}`
  );
  sendNotification(
    'Charity',
    isCaseExist.charity,
    `User ${user.name.firstName} ${user.name.lastName} offered to donate blood to your case ${isCaseExist.title}`,
    3 * 24 * 60 * 60 * 1000,
    'usedItem',
    isCaseExist._id
  );
};
const requestFundraisingCampaign = async (
  caseData: ICase,
  image: string,
  charityId: string,
  storedUser: User
) => {
  const _CharityRepository = new CharityRepository();

  const chosenCharity: ICharity | null = await _CharityRepository.findCharityById(charityId);
  if (!chosenCharity) throw new BadRequestError('no charity found');

  if (
    !chosenCharity.isConfirmed ||
    !chosenCharity.isEnabled ||
    (!chosenCharity?.emailVerification?.isVerified && !chosenCharity?.phoneVerification?.isVerified)
  ) {
    throw new UnauthenticatedError('cant choose this charity');
  }

  caseData.freezed = true; //till the charity accept it will be false
  caseData.user = storedUser._id;

  const responseData = await caseService.addCase(caseData, 'none', chosenCharity, storedUser);

  return {
    case: responseData.case,
  };
};
const logoutUser = (res: Response) => {
  userUtils.logout(res);
  return { message: 'logout' };
};

const getUserProfileData = (user: User) => {
  return { user: user, message: 'User Profile Fetched Successfully' };
};

const editUserProfile = async (reqBody: IUserModified, user: User): Promise<EditProfile> => {
  if (!reqBody) throw new BadRequestError('no data sent');
  if (
    //put restriction  on the edit elements
    !reqBody.name &&
    !reqBody.email &&
    !reqBody.userLocation &&
    !reqBody.gender &&
    !reqBody.phone
  )
    throw new BadRequestError('cant edit that');

  const { email = undefined } = { ...reqBody };

  if (email) {
    //if the edit for email
    // const alreadyRegisteredEmail = await User.findOne({ email });
    const isDupliacated = await userUtils.checkIsEmailDuplicated(email);

    if (isDupliacated) throw new BadRequestError('Email is already taken!');

    const userWithEmailUpdated: { user: User } = await userUtils.changeUserEmailWithMailAlert(
      user,
      email
    ); //email is the NewEmail

    const userObj: IUserModified = {
      name: userWithEmailUpdated.user.name,
      email: userWithEmailUpdated.user.email,
      userLocation: userWithEmailUpdated.user.userLocation,
      gender: userWithEmailUpdated.user.gender,
      phone: userWithEmailUpdated.user.phone,
    };

    return {
      emailAlert: true,
      user: userObj,
      message:
        'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
    };
  }
  updateNestedProperties(user, reqBody);

  await user.save();

  const userObj = {
    name: user.name,
    email: user.email,
    userLocation: user.userLocation, //.governorate,
    gender: user.gender,
    phone: user.phone,
  } satisfies IUserModified;

  return {
    emailAlert: false,
    user: userObj,
    message: 'User Data Changed Successfully',
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
  bloodContribution,
  requestFundraisingCampaign,
};
