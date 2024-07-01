import { authCharityRepository } from '@components/auth/charity/data-access/charity.repository';
import { ICharity } from '@components/charity/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import { deleteOldImgs } from '@utils/deleteFile';
import bcryptjs from 'bcryptjs';

import { CharityData } from '../data-access/interfaces';
import { authCharityUtilsSkeleton } from '../data-access/interfaces/auth.interfaces';

export class authCharityUtilsClass implements authCharityUtilsSkeleton {
  async checkCharityPassword(
    email: string,
    password: string
  ): Promise<{ isMatch: boolean; charity: ICharity }> {
    const charity = await authCharityRepository.findCharity(email);
    if (!charity) throw new NotFoundError('email not found');
    const isMatch = await bcryptjs.compare(password, charity.password);
    if (!isMatch) {
      throw new UnauthenticatedError('invalid password');
    }
    return { isMatch: true, charity: charity };
  }
  checkCharityIsVerified(charity: ICharity): boolean {
    if (
      (charity.emailVerification && charity.emailVerification.isVerified) ||
      (charity.phoneVerification && charity.phoneVerification.isVerified)
    ) {
      return true; //charity verified already
    }
    return false;
  }
  // const checkIsEmailDuplicated = async (email:string) => {
  //   const isDuplicatedEmail = await authCharityRepository.findCharity(email);
  //   if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
  // };
  // const resetSentToken = async (charity) => {
  //   charity.verificationCode = null;
  //   await charity.save();
  // };
  async setTokenToCharity(charity: ICharity, token: string): Promise<void> {
    charity.verificationCode = token;
    await charity.save();
  }

  async createCharity(dataInputs: CharityData): Promise<{ charity: ICharity }> {
    const charityExist = await authCharityRepository.findCharity(dataInputs.email);

    if (charityExist) {
      deleteOldImgs('charityLogos', dataInputs.image);
      throw new BadRequestError('charity is registered already');
    }

    const newCharity = await authCharityRepository.createCharity(dataInputs);

    if (!newCharity) {
      deleteOldImgs('charityLogos', dataInputs.image);
      throw new BadRequestError('Error while Creating the charity');
    }
    return { charity: newCharity };
  }
}
// export const authCharityUtils = {
//   checkCharityPassword,
//   checkCharityIsVerified,
//   createCharity,
//   setTokenToCharity,
// };
