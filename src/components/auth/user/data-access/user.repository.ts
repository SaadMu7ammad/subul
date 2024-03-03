import User from '../../../user/data-access/models/user.model.js';
import { IUser } from '../../../user/data-access/interfaces/user.interface.js';
import { RegisterData } from '../data-access/auth.interface.js';

const findUser = async (email: string): Promise<IUser | undefined> => {
  let user = (await User.findOne({ email: email })) as IUser;
  if (!user) return undefined;
  return user;
};

const createUser = async (
  dataInputs: RegisterData
): Promise<IUser | undefined> => {
  const user = (await User.create(dataInputs)) as IUser;
  if (!user) return undefined;
  return user;
};
export const authUserRepository = {
  findUser,
  createUser,
};
