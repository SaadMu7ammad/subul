import { RegisterUserInputData } from '@components/auth/user/data-access/interfaces';
import { authUserRepository } from '@components/auth/user/data-access/user.repository';
import { IUser } from '@components/user/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import bcryptjs from 'bcryptjs';
import { Request } from 'express';

import { authUserUtilsSkeleton } from '../data-access/interfaces/auth.interfaces';

export class authUserUtilsClass implements authUserUtilsSkeleton {
  constructor() {
    this.checkUserIsVerified = this.checkUserIsVerified.bind(this);
    this.checkUserPassword = this.checkUserPassword.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  async checkUserPassword(
    req: Request,
    email: string,
    password: string
  ): Promise<{ isMatch: boolean; user: IUser }> {
    const user = await authUserRepository.findUser(email);
    if (!user) throw new NotFoundError('email not found');
    const isMatch: boolean = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthenticatedError('invalid password');
    }
    return { isMatch, user: user };
  }

  checkUserIsVerified(user: IUser): boolean {
    if (user.emailVerification?.isVerified) {
      return true; //user verified already
    }
    return false;
  }

  async createUser(dataInputs: RegisterUserInputData): Promise<{ user: IUser }> {
    const userExist: IUser | null = await authUserRepository.findUser(dataInputs.email);
    if (userExist) throw new BadRequestError('user is registered already');
    const user: IUser = await authUserRepository.createUser(dataInputs);
    if (!user) throw new BadRequestError('Error created while creaing the user');
    return { user: user };
  }
}
