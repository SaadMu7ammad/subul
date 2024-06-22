// import { PlainUser } from "../data-access/interfaces";
import { IUser, PlainUser } from '../data-access/interfaces';
import { UserDao } from '../data-access/interfaces';
import UserModel from '../data-access/models/user.model';

class userRepository implements UserDao {
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
export class USER {
  // private user: PlainUser = {} as PlainUser;
  public userModel = new userRepository();

  constructor() {
    // super();
  }
}
