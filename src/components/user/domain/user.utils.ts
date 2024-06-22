import { IUser, userUtilsSkeleton } from '@components/user/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components/index';
import { generateResetTokenTemp, setupMailSender } from '@utils/mailer';
import { Response } from 'express';

import { USER } from './user.class';

export class userUtilsClass implements userUtilsSkeleton {
  #user = new USER();
  // constructor(){}

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
    await setupMailSender(
      UserBeforeUpdate.email,
      'email changed alert',
      `hi ${
        UserBeforeUpdate?.name?.firstName + ' ' + UserBeforeUpdate?.name?.lastName
      }email has been changed You must Re activate account ` +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
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
// export const userUtilsClass:userUtils = new userUtils();
// = {
//   checkUserIsExist,
//   checkUserIsExistById,
//   logout,
//   //   getUser,
//   checkIsEmailDuplicated,
//   verifyUserAccount,
//   resetSentToken,
//   changeUserEmailWithMailAlert,
//   deleteCaseFromUserContributionsArray,
//   checkIfCaseBelongsToUserContributions,
// };
