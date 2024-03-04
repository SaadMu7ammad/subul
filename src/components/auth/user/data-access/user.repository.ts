import User from '../../../user/data-access/models/user.model';
import {
  IUser,
  IUserDocument,
} from '../../../user/data-access/interfaces/user.interface';
import { IRegisterData } from '../data-access/auth.interface.js';

// const findUser = async (email: string): Promise<IUserDocument | null> => {
//   let user = (await User.findOne({ email: email })) as IUserDocument | null;
//   return user;
// };

const findUser = async (email: string): Promise<IUserDocument | null> => {
  let user = (await User.findOne({ email: email } as {
    email: string;
  })) as IUserDocument | null;
  return user;
};

const createUser = async (
  dataInputs: IRegisterData
): Promise<IUser | undefined> => {
  const user = await User.create(dataInputs);
  if (!user) return undefined;

  return user as IUser;
};

export const authUserRepository = {
  findUser,
  createUser,
};
