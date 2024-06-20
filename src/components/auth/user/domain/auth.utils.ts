import { RegisterUserInputData } from '@components/auth/user/data-access/interfaces';
import { authUserRepository } from '@components/auth/user/data-access/user.repository';
import { IUser } from '@components/user/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import bcryptjs from 'bcryptjs';

const checkUserPassword = async (
  email: string,
  password: string
): Promise<{ isMatch: boolean; user: IUser }> => {
  const user = await authUserRepository.findUser(email);
  if (!user) throw new NotFoundError('email not found');
  const isMatch: boolean = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch, user: user };
};

const checkUserIsVerified = (user: IUser): boolean => {
  if (user.emailVerification?.isVerified) {
    return true; //user verified already
  }
  return false;
};

const createUser = async (dataInputs: RegisterUserInputData): Promise<{ user: IUser }> => {
  const userExist: IUser | null = await authUserRepository.findUser(dataInputs.email);
  if (userExist) throw new BadRequestError('user is registered already');
  const user: IUser = await authUserRepository.createUser(dataInputs);
  if (!user) throw new BadRequestError('Error created while creaing the user');
  return { user: user };
};
export const authUserUtils = {
  checkUserPassword,
  checkUserIsVerified,
  createUser,
};
