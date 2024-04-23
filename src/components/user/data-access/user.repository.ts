import { UserDao } from './interfaces/user.dao';
// import { IUser, IUserDocument } from './interfaces/user.interface';
import UserModel, { User } from './models/user.model';

export class userRepository implements UserDao {
  async findUser(email: string): Promise<User | null> {
    const user: User | null = await UserModel.findOne({
      email: email,
    });
    return user;
  }
  async findUserById(id: string): Promise<User | null> {
    const user: User | null = await UserModel.findById(id);
    return user;
  }
  async createUser(dataInputs: User): Promise<User> {
    const user: User = await UserModel.create(dataInputs);

    return user;
  }
}
