import bcryptjs from 'bcryptjs';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../../libraries/errors/components/index.js';
import { authCharityRepository } from '../data-access/charity.repository.js';
import { deleteOldImgs } from '../../../../utils/deleteFile.js';
const checkCharityPassword = async (email, password) => {
  const charity = await authCharityRepository.findCharity(email);
  if (!charity) throw new NotFoundError('email not found');
  const isMatch = await bcryptjs.compare(password, charity.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, charity: charity };
};
const checkCharityIsVerified = (charity) => {
  if (
    charity.emailVerification.isVerified ||
    charity.phoneVerification.isVerified
  ) {
    return true; //charity verified already
  }
  return false;
};
const checkIsEmailDuplicated = async (email) => {
  const isDuplicatedEmail = await authCharityRepository.findCharity(email);
  if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const resetSentToken = async (charity) => {
  charity.verificationCode = null;
  await charity.save();
};
const setTokenToCharity = async (charity, token) => {
  charity.verificationCode = token;
  await charity.save();
};
const createCharity = async (dataInputs) => {
  const charityExist = await authCharityRepository.findCharity(
    dataInputs.email
  );
  if (charityExist) {
    deleteOldImgs('charityLogos', dataInputs.image);
    throw new BadRequestError('charity is registered already');
  }
  const newCharity = await authCharityRepository.createCharity(dataInputs);
  console.log('newww' + newCharity);
  if (!newCharity) {
    deleteOldImgs('charityLogos', dataInputs.image);
    throw new BadRequestError('Error created while creaing the charity');
  }
  return { charity: newCharity };
};
export const authCharityUtils = {
  checkCharityPassword,
  checkCharityIsVerified,
  createCharity,
  setTokenToCharity,
};
