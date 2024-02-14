import fs from 'fs';
import path from 'path';
import bcryptjs from 'bcryptjs';
import { charityRepository } from '../data-access/charity.repository.js';
import { charityService } from './charity.service.js';
import generateToken from '../../../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import {
  setupMailSender,
  generateResetTokenTemp,
} from '../../../utils/mailer.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';
// import logger from '../utils/logger.js';

const activateCharityAccount = async (req, res, next) => {
  let storedCharity = req.charity;
  const { token } = req.body;
  const data = {
    token,
  };
  const activateCharityAccountResponse = await charityService.activateAccount(
    data,
    storedCharity,
    res
  );

  return {
    message: activateCharityAccountResponse.message,
  };
};

const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;
  const data = {
    email,
  };
  const requestResetPasswordResponse =
    await charityService.requestResetPassword(data);
  return {
    message: requestResetPasswordResponse.message,
  };
};

const confirmResetPassword = async (req, res, next) => {
  const { token, email, password } = req.body;
  const data = {
    token,
    email,
    password,
  };
  // let charity = await Charity.findOne({ email });
  // if (!charity) throw new NotFoundError('No charity found with this email');
  const confirmResetPasswordResponse =
    await charityService.confirmResetPassword(data);

  return { message: confirmResetPasswordResponse.message };
};

const changePassword = async (req, res, next) => {
  const { password } = req.body;
  const storedCharity = req.charity;
  const changePasswordResponse = await charityService.changePassword(
    password,
    storedCharity
  );
  return { message: changePasswordResponse.message };
};
const showCharityProfile = (req, res, next) => {
  // const charity = await charityRepository.findCharityById(req.charity._id).select(
  //   '-_id -password -verificationCode -emailVerification -phoneVerification -isEnabled -isConfirmed -isPending'
  // );
  const storedCharity = req.charity;
  const responseData = charityService.getCharityProfileData(storedCharity);
  return {
    charity: responseData.charity,
  };
};
const editCharityProfile = async (req, res, next) => {
  const dataInput = {
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    locationId: req.body.locationId,
    contactInfo: req.body.contactInfo,
    description: req.body.description,
  };
  const storedCharity = req.charity;
  const responseData = await charityService.editCharityProfile(
    dataInput,
    storedCharity
  );
  return {
    charity: responseData.charity,
    message: responseData.message,
  };
};
const changeProfileImage = async (req, res, next) => {
  const data = {
    image: req.body.image[0],
  };
  const storedCharity = req.charity;
  const responseData = await charityService.changeProfileImage(
    data,
    storedCharity
  );
  return { image: responseData.image,message:responseData.message };
};

const requestEditCharityPayments = async (req, res, next) => {
    const reqPaymentMethodsObj = req.body.paymentMethods;
    const responseData = await charityService.requestEditCharityPayments(
        req.charity,
        req.body.payment_id,
        reqPaymentMethodsObj,
    );

    return {
        paymentMethod: responseData.paymentMethod,
        message: responseData.message,
    };
};


const logout = (req, res, next) => {
  const responseData = charityService.logoutCharity(res);
  return {
    message: responseData.message,
  };
};

const sendDocs = async (req, res, next) => {
  const data = {
    charityDocs: {
      docs1: req.body.charityDocs.docs1,
      docs2: req.body.charityDocs.docs2,
      docs3: req.body.charityDocs.docs3,
      docs4: req.body.charityDocs.docs4,
    },
    paymentMethods: {
      bankAccount: req.body.paymentMethods['bankAccount'],
      fawry: req.body.paymentMethods['fawry'],
      vodafoneCash: req.body.paymentMethods['vodafoneCash'],
    },
  };
  const storedCharity = req.charity;
  const responseData = await charityService.sendDocs(data, storedCharity);
  return {
    paymentMethods: responseData.paymentMethods,
    message: responseData.message,
  };
};
export const charityUseCase = {
  activateCharityAccount,
  requestResetPassword,
  confirmResetPassword,
  logout,
  changePassword,
  changeProfileImage,
  sendDocs,
  editCharityProfile,
  showCharityProfile,
  requestEditCharityPayments,
  // addCharityPayments,
};
