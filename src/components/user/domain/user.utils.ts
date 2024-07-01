import { User } from '@components/user/data-access/interfaces';
import { userRepository } from '@components/user/data-access/user.repository';
import { NotFoundError } from '@libs/errors/components/index';
import { generateResetTokenTemp, sendReactivationEmail } from '@utils/mailer';
import { Response } from 'express';

const userRepositoryObj = new userRepository();

const checkUserIsExist = async (email: string): Promise<{ user: User }> => {
  //return user if it exists
  const userIsExist = await userRepositoryObj.findUser(email);

  if (!userIsExist) {
    throw new NotFoundError('email not found Please use another one');
  }

  return {
    user: userIsExist,
  };
};
const checkUserIsExistById = async (id: string): Promise<{ user: User }> => {
  //return user if it exists
  const userIsExist = await userRepositoryObj.findUserById(id);

  if (!userIsExist) {
    throw new NotFoundError('user not found');
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

// // const getUser = (res:Response): Partial<IUserResponse> => {
// //   return { user: res.locals.user };
// // };
const checkIsEmailDuplicated = async (email: string): Promise<boolean> => {
  const isDuplicatedEmail: User | null = await userRepositoryObj.findUser(email);
  // if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
  return isDuplicatedEmail ? true : false;
};

const changeUserEmailWithMailAlert = async (
  UserBeforeUpdate: User,
  newEmail: string
): Promise<{ user: User }> => {
  //for sending email if changed or edited
  UserBeforeUpdate.email = newEmail;

  if (UserBeforeUpdate.emailVerification) {
    UserBeforeUpdate.emailVerification = {
      isVerified: false,
      verificationDate: '',
    };
  }
  // UserBeforeUpdate.emailVerification.isVerified = false;
  // UserBeforeUpdate.emailVerification.verificationDate = undefined;

  const token = await generateResetTokenTemp();
  UserBeforeUpdate.verificationCode = token;
  await sendReactivationEmail(UserBeforeUpdate.email, token);
  await UserBeforeUpdate.save();
  return { user: UserBeforeUpdate };
};

// const verifyUserAccount = async (user: User) => {
//   user.verificationCode = '';
// // Optional chaining not allowed when assigning a value
//   user.emailVerification.isVerified = true;
//   user.emailVerification.verificationDate = Date.now().toString();
//   user = await user.save();
// };
const verifyUserAccount = async (user: User) => {
  user.verificationCode = '';
  // Make sure emailVerification exists before assigning values
  if (!user.emailVerification) {
    user.emailVerification = {
      isVerified: false,
      verificationDate: '',
    };
  }
  user.emailVerification.isVerified = true;
  user.emailVerification.verificationDate = Date.now().toString();
  user = await user.save();
};
const checkIfCaseBelongsToUserContributions = (
  userContributionsArray: User['_id'][],
  caseId: string
): number => {
  const idx: number = userContributionsArray.findIndex(function (id) {
    return id.toString() === caseId;
  });

  if (idx === -1) {
    throw new NotFoundError('No Such Case With this Id!');
  }

  return idx;
};

const deleteCaseFromUserContributionsArray = async (user: User, idx: number) => {
  const caseIdsArray = user.contributions;

  caseIdsArray.splice(idx, 1);

  user.contributions = caseIdsArray;

  await user.save();
};
const resetSentToken = async (user: User) => {
  user.verificationCode = '';
  user = await user.save();
};
export const userUtils = {
  checkUserIsExist,
  checkUserIsExistById,
  logout,
  //   getUser,
  checkIsEmailDuplicated,
  verifyUserAccount,
  resetSentToken,
  changeUserEmailWithMailAlert,
  deleteCaseFromUserContributionsArray,
  checkIfCaseBelongsToUserContributions,
};
