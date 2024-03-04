import bcryptjs from 'bcryptjs';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../../libraries/errors/components/index';
import { authUserRepository } from '../data-access/user.repository';
import {
  IUser,
  IUserDocument,
} from '../../../user/data-access/interfaces/user.interface';
const checkUserPassword = async (
  email: string,
  password: string
): Promise<{ isMatch: boolean; user: IUserDocument }> => {
  const user = await authUserRepository.findUser(email);
  if (!user) throw new NotFoundError('email not found');
  const isMatch: boolean = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, user: user };
};
const checkUserIsVerified = (user: IUserDocument): boolean => {
  if (user.emailVerification.isVerified) {
    return true; //user verified already
  }
  return false;
};
const createUser = async (
  dataInputs: IUser
): Promise<{ user: IUserDocument }> => {
  const userExist = await authUserRepository.findUser(dataInputs.email);
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await authUserRepository.createUser(dataInputs);
  if (!user) throw new BadRequestError('Error created while creaing the user');
  return { user: user };
};
export const authUserUtils = {
  checkUserPassword,
  checkUserIsVerified,
  createUser,
};
