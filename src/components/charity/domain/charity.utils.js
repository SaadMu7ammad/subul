import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index.js';
import { charityRepository } from '../data-access/charity.repository.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';
const checkCharityPassword = async (email, password) => {
  const charity = await charityRepository.findCharity(email);
  if (!charity) throw new NotFoundError('email not found');
  const isMatch = await bcryptjs.compare(password, charity.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, charity: charity };
};
const checkCharityIsVerified = (charity) => {
  if (charity.emailVerification.isVerified) {
    return true; //charity verified already
  }
  return false;
};
const createCharity = async (dataInputs) => {
  const charityExist = await charityRepository.findCharity(dataInputs.email);
  if (charityExist) throw new BadRequestError('charity is registered already');
  const charity = await charityRepository.createCharity(dataInputs);
  if (!charity)
    throw new BadRequestError('Error created while creaing the charity');
  return { charity: charity };
};
const checkCharityIsExist = async (email) => {
  //return charity if it exists
  const charityIsExist = await charityRepository.findCharity(email);
  if (!charityIsExist) {
    throw new NotFoundError('email not found Please use another one');
  }
  return {
    charity: charityIsExist,
  };
};
const logout = (res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
const getCharity = (req) => {
  return { charity: req.charity };
};
const checkIsEmailDuplicated = async (email) => {
  const isDuplicatedEmail = await charityRepository.findCharity(email);
  if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const changeCharityEmailWithMailAlert = async (
  CharityBeforeUpdate,
  newEmail
) => {
  //for sending email if changed or edited
  CharityBeforeUpdate.email = newEmail;
  CharityBeforeUpdate.emailVerification.isVerified = false;
  CharityBeforeUpdate.emailVerification.verificationDate = null;
  const token = await generateResetTokenTemp();
  CharityBeforeUpdate.verificationCode = token;
  await setupMailSender(
    CharityBeforeUpdate.email,
    'email changed alert',
    `hi ${CharityBeforeUpdate.name}email has been changed You must Re activate account ` +
      `<h3>(www.activate.com)</h3>` +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  await CharityBeforeUpdate.save();
  return { charity: CharityBeforeUpdate };
};
const verifyCharityAccount = async (charity) => {
  charity.verificationCode = null;
  charity.emailVerification.isVerified = true;
  charity.emailVerification.verificationDate = Date.now();
  charity = await charity.save();
};
const resetSentToken = async (charity) => {
  charity.verificationCode = null;
  charity = await charity.save();
};
export const charityUtils = {
  checkCharityPassword,
  checkCharityIsVerified,
  createCharity,
  checkCharityIsExist,
  logout,
  getCharity,
  checkIsEmailDuplicated,
  verifyCharityAccount,
  resetSentToken,
  changeCharityEmailWithMailAlert,
};
