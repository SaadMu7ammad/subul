import { IUser, PlainUser, UserDao } from './interfaces/';
// import { IUser, IUserDocument } from './interfaces/user.interface';
import UserModel from './models/user.model';

export class userRepository implements UserDao {
  async findUser(email: string): Promise<IUser | null> {
    const user: IUser | null = await UserModel.findOne({
      email: email,
    });
    return user;
  }
  async findUserById(id: string): Promise<IUser | null> {
    const user: IUser | null = await UserModel.findById(id);
    return user;
  }
  async createUser(dataInputs: PlainUser): Promise<IUser> {
    const user: IUser = await UserModel.create(dataInputs);

    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users: IUser[] = await UserModel.find();
    return users;
  }
}
