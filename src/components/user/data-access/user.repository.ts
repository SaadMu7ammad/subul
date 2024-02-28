import { userDataStore } from './interfaces/user.dao';
import {  IUserDocument } from './interfaces/user.interface';
import UserModel from './models/user.model';

export class userRepository implements userDataStore {
  async findUser(email: string): Promise<IUserDocument | undefined> {
    const user = await UserModel.findOne({ email: email });
    if (!user) return undefined;
    return user;
  }
  async findUserById(id: string): Promise<IUserDocument | undefined> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    return user;
  }
  async createUser(
    dataInputs: Partial<IUserDocument>
  ): Promise<Partial<IUserDocument> | undefined> {
    const user = await UserModel.create(dataInputs);
    if (!user) return undefined;
    return user;
  }
}
