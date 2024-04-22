import bcryptjs from 'bcryptjs';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../../libraries/errors/components/index';
import { authCharityRepository } from '../data-access/charity.repository';
import { deleteOldImgs } from '../../../../utils/deleteFile';
import { ICharity } from '../../../charity/data-access/interfaces/';
import { CharityData } from './auth.use-case';
const checkCharityPassword = async (email: string, password: string) => {
  const charity = await authCharityRepository.findCharity(email);
  if (!charity) throw new NotFoundError('email not found');
  const isMatch = await bcryptjs.compare(password, charity.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, charity: charity };
};
const checkCharityIsVerified = (charity: ICharity) => {
  if (
    (charity.emailVerification && charity.emailVerification.isVerified) ||
    (charity.phoneVerification && charity.phoneVerification.isVerified)
  ) {
    return true; //charity verified already
  }
  return false;
};
// const checkIsEmailDuplicated = async (email:string) => {
//   const isDuplicatedEmail = await authCharityRepository.findCharity(email);
//   if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
// };
// const resetSentToken = async (charity) => {
//   charity.verificationCode = null;
//   await charity.save();
// };
const setTokenToCharity = async (charity: ICharity, token: string) => {
  charity.verificationCode = token;
  await charity.save();
};

const createCharity = async (
  dataInputs: CharityData
): Promise<{ charity: ICharity }> => {
  const charityExist = await authCharityRepository.findCharity(
    dataInputs.email
  );

  if (charityExist) {
    deleteOldImgs('charityLogos', dataInputs.image);
    throw new BadRequestError('charity is registered already');
  }

  const newCharity = await authCharityRepository.createCharity(dataInputs);
  console.log('New' + newCharity);
  if (!newCharity) {
    deleteOldImgs('charityLogos', dataInputs.image);
    throw new BadRequestError('Error while Creating the charity');
  }
  return { charity: newCharity };
};

export const authCharityUtils = {
  checkCharityPassword,
  checkCharityIsVerified,
  createCharity,
  setTokenToCharity,
};
