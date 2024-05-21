import { User } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';

import { RegisterUserInputData } from './interfaces';

const findUser = async (email: string): Promise<User | null> => {
  let user: User | null = await UserModel.findOne({ email: email });
  return user;
};

const createUser = async (dataInputs: RegisterUserInputData): Promise<User> => {
  const user: User = await UserModel.create(dataInputs);
  return user;
};

export const authUserRepository = {
  findUser,
  createUser,
};
