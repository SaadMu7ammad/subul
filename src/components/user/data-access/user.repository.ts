import { userDataStore } from './interfaces/user.dao';
import { IUser, IUserDocument } from './interfaces/user.interface';
import UserModel from './models/user.model';

export class userRepository implements userDataStore {
  async findUser(email: string): Promise<IUserDocument | null> {
    const user = (await UserModel.findOne({
      email: email,
    })) as IUserDocument | null;
    return user;
  }
  async findUserById(id: string): Promise<IUserDocument | null> {
    const user = (await UserModel.findById(id)) as IUserDocument | null;
    return user;
  }
  async createUser(dataInputs: IUser): Promise<IUserDocument | null> {
    const user = (await UserModel.create(dataInputs)) as IUserDocument | null;

    return user;
  }
}
