import { IUser } from './user.interface';

export interface userDataStore {
  findUser(email: string): Promise<IUser | undefined>;
  findUserById(id: string): Promise<IUser | undefined>;
  createUser(dataInputs: Partial<IUser>): Promise<Partial<IUser> | undefined>;
}
