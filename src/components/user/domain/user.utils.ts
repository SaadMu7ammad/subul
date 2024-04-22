import { NotFoundError } from '../../../libraries/errors/components/index';
import { userRepository } from '../data-access/user.repository';
import { generateResetTokenTemp, setupMailSender } from '../../../utils/mailer';
import { Response } from 'express';
import { User } from '../data-access/models/user.model';
const userRepositoryObj = new userRepository();

const checkUserIsExist = async (email: string): Promise<{ user: User }> => {
  //return user if it exists
  const userIsExist: User | null = await userRepositoryObj.findUser(email);
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

// // const getUser = (res:Response): Partial<IUserResponse> => {
// //   return { user: res.locals.user };
// // };
const checkIsEmailDuplicated = async (email: string): Promise<boolean> => {
  const isDuplicatedEmail: User | null = await userRepositoryObj.findUser(
    email
  );
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

const resetSentToken = async (user: User) => {
  user.verificationCode = '';
  user = await user.save();
};
export const userUtils = {
  checkUserIsExist,
  logout,
  //   getUser,
  checkIsEmailDuplicated,
  verifyUserAccount,
  resetSentToken,
  changeUserEmailWithMailAlert,
};
