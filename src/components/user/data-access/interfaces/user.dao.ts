import { IUser, IUserDocument } from './user.interface';

export interface userDataStore {
  findUser(email: string): Promise<IUserDocument | null>;
  findUserById(id: string): Promise<IUserDocument | null>;
  createUser(dataInputs: IUser): Promise<IUserDocument | null>;
}
