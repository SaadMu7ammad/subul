import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../../libraries/errors/components/index.js';
import { userRepository } from '../../../user/data-access/user.repository.js';
const checkUserPassword = async (email, password) => {
  const user = await userRepository.findUser(email);
  if (!user) throw new NotFoundError('email not found');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, user: user };
};
const checkUserIsVerified = (user) => {
  if (user.emailVerification.isVerified) {
    return true; //user verified already
  }
  return false;
};
const createUser = async (dataInputs) => {
  const userExist = await userRepository.findUser(dataInputs.email);
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await userRepository.createUser(dataInputs);
  if (!user) throw new BadRequestError('Error created while creaing the user');
  return { user: user };
};
export const authUserUtils = {
  checkUserPassword,
  checkUserIsVerified,
  createUser,
};
