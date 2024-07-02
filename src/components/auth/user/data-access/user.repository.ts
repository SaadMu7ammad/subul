import { IUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';

import { RegisterUserInputData } from './interfaces';

const findUser = async (email: string): Promise<IUser | null> => {
  const user: IUser | null = await UserModel.findOne({ email: email });
  return user;
};

const createUser = async (dataInputs: RegisterUserInputData): Promise<IUser> => {
  const user: IUser = await UserModel.create(dataInputs);
  return user;
};

export const authUserRepository = {
  findUser,
  createUser,
};
