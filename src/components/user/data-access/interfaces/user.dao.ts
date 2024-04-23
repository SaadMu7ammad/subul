import { User } from '../models/user.model';
// import { IUser, IUserDocument } from './user.interface';

export interface UserDao {
  findUser(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  createUser(dataInputs: User): Promise<User>;
}
