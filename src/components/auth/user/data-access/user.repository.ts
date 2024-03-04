import User from '../../../user/data-access/models/user.model';
import {
  IUser,
  IUserDocument,
} from '../../../user/data-access/interfaces/user.interface';
import { RegisterData } from '../data-access/auth.interface.js';

const findUser = async (email: string): Promise<IUserDocument | null> => {
  let user = (await User.findOne({ email: email })) as IUserDocument | null;
  return user;
};
const createUser = async (
  dataInputs: RegisterData
): Promise<IUser | undefined> => {
  const user = await User.create(dataInputs);
  if (!user) return undefined;
  return user;
};
export const authUserRepository = {
  findUser,
  createUser,
};
