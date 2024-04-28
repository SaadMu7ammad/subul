import bcryptjs from 'bcryptjs';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../../libraries/errors/components/index';
import { authUserRepository } from '../data-access/user.repository';
import { User } from '../../../user/data-access/models/user.model';
import { RegisterUserInputData } from '../data-access/interfaces';

const checkUserPassword = async (
  email: string,
  password: string
): Promise<{ isMatch: boolean; user: User }> => {
  const user = await authUserRepository.findUser(email);
  if (!user) throw new NotFoundError('email not found');
  const isMatch: boolean = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch, user: user };
};

const checkUserIsVerified = (user: User): boolean => {
  if (user.emailVerification?.isVerified) {
    return true; //user verified already
  }
  return false;
};

const createUser = async (
  dataInputs: RegisterUserInputData
): Promise<{ user: User }> => {
  const userExist: User | null = await authUserRepository.findUser(
    dataInputs.email
  );
  if (userExist) throw new BadRequestError('user is registered already');
  const user: User = await authUserRepository.createUser(dataInputs);
  if (!user) throw new BadRequestError('Error created while creaing the user');
  return { user: user };
};
export const authUserUtils = {
  checkUserPassword,
  checkUserIsVerified,
  createUser,
};
