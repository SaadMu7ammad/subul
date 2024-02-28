import { userDataStore } from './interfaces/user.dao.js';
import {  IUserDocument } from './interfaces/user.interface.js';
import UserModel from './models/user.model.js';

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
