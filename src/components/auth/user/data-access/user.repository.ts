import User from '../../../user/data-access/models/user.model';
import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
import { RegisterUSerInputData } from '../domain/auth.use-case';

const findUser = async (email: string): Promise<IUserDocument | null> => {
  let user: IUserDocument | null = await User.findOne({ email: email });
  return user;
};

const createUser = async (
  dataInputs: RegisterUSerInputData
): Promise<IUserDocument> => {
  // @ts-expect-error
  const user: IUserDocument = await User.create(dataInputs);
  return user;
};

export const authUserRepository = {
  findUser,
  createUser,
};
