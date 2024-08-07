import { IUser, userUtilsSkeleton } from '@components/user/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components/index';
import { generateResetTokenTemp, sendReactivationEmail } from '@utils/mailer';
import { Response } from 'express';

import { USER } from './user.class';

export class userUtilsClass implements userUtilsSkeleton {
  #user: USER;
  constructor() {
    this.#user = new USER();

    this.checkUserIsExist = this.checkUserIsExist.bind(this);
    this.checkUserIsExistById = this.checkUserIsExistById.bind(this);
    this.logout = this.logout.bind(this);
    this.checkIsEmailDuplicated = this.checkIsEmailDuplicated.bind(this);
    this.changeUserEmailWithMailAlert = this.changeUserEmailWithMailAlert.bind(this);
    this.verifyUserAccount = this.verifyUserAccount.bind(this);
    this.checkIfCaseBelongsToUserContributions =
      this.checkIfCaseBelongsToUserContributions.bind(this);
    this.deleteCaseFromUserContributionsArray =
      this.deleteCaseFromUserContributionsArray.bind(this);
    this.resetSentToken = this.resetSentToken.bind(this);
  }

  async checkUserIsExist(email: string): Promise<{ user: IUser }> {
    //return user if it exists
    const userIsExist = await this.#user.userModel.findUser(email);

    if (!userIsExist) {
      throw new NotFoundError('email not found Please use another one');
    }

    return {
      user: userIsExist,
    };
  }
  async checkUserIsExistById(id: string): Promise<{ user: IUser }> {
    //return user if it exists
    const userIsExist = await this.#user.userModel.findUserById(id);

    if (!userIsExist) {
      throw new NotFoundError('user not found');
    }

    return {
      user: userIsExist,
    };
  }
  logout(res: Response): void {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  // // const getUser = (res:Response): Partial<IUserResponse>  {
  // //   return { user: res.locals.user };
  // // };
  async checkIsEmailDuplicated(email: string): Promise<boolean> {
    const isDuplicatedEmail: IUser | null = await this.#user.userModel.findUser(email);
    // if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
    return isDuplicatedEmail ? true : false;
  }

  async changeUserEmailWithMailAlert(
    UserBeforeUpdate: IUser,
    newEmail: string
  ): Promise<{ user: IUser }> {
    //for sending email if changed or edited
    UserBeforeUpdate.email = newEmail;

    if (UserBeforeUpdate.emailVerification) {
      UserBeforeUpdate.emailVerification = {
        isVerified: false,
        verificationDate: '',
      };
    }
    // UserBeforeUpdate.emailVerification.isVerified = false;
    // UserBeforeUpdate.emailVerification.verificationDate = undefined;

    const token = await generateResetTokenTemp();
    UserBeforeUpdate.verificationCode = token;
    await sendReactivationEmail(UserBeforeUpdate.email, token);
    await UserBeforeUpdate.save();
    return { user: UserBeforeUpdate };
  }

  // const verifyUserAccount = async (user: User)  {
  //   user.verificationCode = '';
  // // Optional chaining not allowed when assigning a value
  //   user.emailVerification.isVerified = true;
  //   user.emailVerification.verificationDate = Date.now().toString();
  //   user = await user.save();
  // };
  async verifyUserAccount(user: IUser): Promise<void> {
    user.verificationCode = '';
    // Make sure emailVerification exists before assigning values
    if (!user.emailVerification) {
      user.emailVerification = {
        isVerified: false,
        verificationDate: '',
      };
    }
    user.emailVerification.isVerified = true;
    user.emailVerification.verificationDate = Date.now().toString();
    user = await user.save();
  }
  checkIfCaseBelongsToUserContributions(
    userContributionsArray: IUser['_id'][],
    caseId: string
  ): number {
    const idx: number = userContributionsArray.findIndex(function (id) {
      return id.toString() === caseId;
    });

    if (idx === -1) {
      throw new NotFoundError('No Such Case With this Id!');
    }

    return idx;
  }

  async deleteCaseFromUserContributionsArray(user: IUser, idx: number): Promise<void> {
    const caseIdsArray = user.contributions;

    caseIdsArray.splice(idx, 1);

    user.contributions = caseIdsArray;

    await user.save();
  }
  async resetSentToken(user: IUser): Promise<void> {
    user.verificationCode = '';
    user = await user.save();
  }
}
