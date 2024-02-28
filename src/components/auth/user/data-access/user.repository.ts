import User from '../../../user/data-access/models/user.model.js';
import { IUser } from '../../../user/data-access/interfaces/user.interface.js';
const findUser = async (email: string): Promise<IUser | undefined> => {
  let user = await User.findOne({ email: email });
  if (!user) return undefined;
  return user;
};
const createUser = async (dataInputs: IUser): Promise<IUser|undefined> => {
  const user = await User.create(dataInputs);
  if (!user) return undefined;
  return user;
};
export const authUserRepository = {
  findUser,
  createUser,
};
