import User from '../../../user/data-access/models/user.model';
import { IUser, IUserDocument } from '../../../user/data-access/interfaces/user.interface';
const findUser = async (email: string): Promise<IUserDocument | null> => {
  let user = await User.findOne({ email: email }) as IUserDocument|null;
  return user;
};
const createUser = async (dataInputs: IUser): Promise<IUserDocument|null> => {
  const user = await User.create(dataInputs)as IUserDocument|null;;
  return user;
};
export const authUserRepository = {
  findUser,
  createUser,
};
