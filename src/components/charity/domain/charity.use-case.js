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
import dot from 'dot-object';
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
  const dataResponsed = charityService.getCharityProfileData(storedCharity);
  return {
    charity: dataResponsed.charity,
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
  const dataResponsed = await charityService.editCharityProfile(
    dataInput,
    storedCharity
  );
  return {
    charity: dataResponsed.charity,
  };
};
const changeProfileImage = async (req, res, next) => {
  const data = {
    image: req.body.image[0],
  };
  const storedCharity = req.charity;
  const dataResponsed = await charityService.changeProfileImage(
    data,
    storedCharity
  );
  return { image: dataResponsed.image };
};

// const editCharityProfilePaymentMethods = asyncHandler(
//     async (req, res, next, indx, selector) => {
//         const temp = {}; // Create a tempLocation object
//         // temp.docsBank=[]
//         if (selector === 'bankAccount') {
//             const { accNumber, iban, swiftCode } =
//                 req.body.paymentMethods.bankAccount[0];
//             const docsBank = req.body.paymentMethods.bankAccount.docsBank[0];

//             console.log(accNumber);
//             console.log(iban);
//             console.log(swiftCode);
//             temp.accNumber = accNumber;
//             temp.iban = iban;
//             temp.swiftCode = swiftCode;
//             temp.docsBank = docsBank;
//         } else if (selector === 'fawry') {
//             const { number } = req.body.paymentMethods.fawry[0];
//             const docsFawry = req.body.paymentMethods.fawry.docsFawry[0];

//             console.log(number);
//             temp.number = number;
//             temp.docsFawry = docsFawry;
//         } else if (selector === 'vodafoneCash') {
//             const { number } = req.body.paymentMethods.vodafoneCash[0];
//             const docsVodafoneCash =
//                 req.body.paymentMethods.vodafoneCash.docsVodafoneCash[0];
//             temp.number = number;
//             temp.docsVodafoneCash = docsVodafoneCash;
//         }
//         if (indx !== -1) {
//             //edit a payment account && enable attribute will be reset to false again
//             if (selector === 'bankAccount') {
//                 deleteOldImgs(
//                     'docsCharities',
//                     req.charity.paymentMethods.bankAccount[indx].docsBank
//                 );
//                 req.charity.paymentMethods.bankAccount[indx].accNumber =
//                     temp.accNumber; //assign the object
//                 req.charity.paymentMethods.bankAccount[indx].iban = temp.iban; //assign the object
//                 req.charity.paymentMethods.bankAccount[indx].swiftCode =
//                     temp.swiftCode; //assign the object
//                 req.charity.paymentMethods.bankAccount[indx].docsBank = [
//                     temp.docsBank,
//                 ];
//                 req.charity.paymentMethods.bankAccount[indx].enable = false; //reset again to review it again
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 return res.json(req.charity.paymentMethods.bankAccount[indx]);
//             } else if (selector === 'fawry') {
//                 deleteOldImgs(
//                     'docsCharities',
//                     req.charity.paymentMethods.fawry[indx].docsFawry
//                 );
//                 req.charity.paymentMethods.fawry[indx].number = temp.number; //assign the object
//                 req.charity.paymentMethods.fawry[indx].docsFawry =
//                     temp.docsFawry;
//                 req.charity.paymentMethods.fawry[indx].enable = false; //reset again to review it again
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 return res.json(req.charity.paymentMethods.fawry[indx]);
//             } else if (selector === 'vodafoneCash') {
//                 deleteOldImgs(
//                     'docsCharities',
//                     req.charity.paymentMethods.vodafoneCash[indx]
//                         .docsVodafoneCash
//                 );
//                 req.charity.paymentMethods.vodafoneCash[indx].number =
//                     temp.number; //assign the object
//                 req.charity.paymentMethods.vodafoneCash[indx].docsVodafoneCash =
//                     temp.docsVodafoneCash;
//                 req.charity.paymentMethods.vodafoneCash[indx].enable = false; //reset again to review it again
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 return res.json(req.charity.paymentMethods.vodafoneCash[indx]);
//             }
//         } else if (indx === -1) {
//             //add a new payment account
//             //add a new address
//             if (selector === 'bankAccount') {
//                 // const { docsVodafoneCash} = req.body.paymentMethods.docsVodafoneCash[0];
//                 // req.charity.paymentMethods.vodafoneCash[indx].docsVodafoneCash=docsVodafoneCash
//                 req.charity.paymentMethods.bankAccount.push(temp); //assign the object
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 const len = req.charity.paymentMethods.bankAccount.length - 1;
//                 return res.json(req.charity.paymentMethods.bankAccount[len]);
//             } else if (selector === 'fawry') {
//                 req.charity.paymentMethods.fawry.push(temp); //assign the object
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 const len = req.charity.paymentMethods.fawry.length - 1;
//                 return res.json(req.charity.paymentMethods.fawry[len]);
//             } else if (selector === 'vodafoneCash') {
//                 req.charity.paymentMethods.vodafoneCash.push(temp); //assign the object
//                 // req.charity.modifyPaymentMethodsRequest = true;

//                 await req.charity.save();
//                 const len = req.charity.paymentMethods.vodafoneCash.length - 1;
//                 return res.json(req.charity.paymentMethods.vodafoneCash[len]);
//             }
//         }
//     }
// );
// const requestEditCharityProfilePayments = asyncHandler(
//     async (req, res, next) => {
//         if (!req.body.paymentMethods) {
//             deleteOldImgs('docsCharities', req.temp);
//             throw new BadRequestError(
//                 'you must upload complete data to be sent'
//             );
//         }
//         const { bankAccount, fawry, vodafoneCash } = req.body.paymentMethods;
//         // 1-> bankAccount
//         // console.log(bankAccount[0]);
//         // console.log(req.body.paymentMethods);
//         if (bankAccount) {
//             let indx = req.charity.paymentMethods.bankAccount.findIndex(
//                 (paymentMethods) =>
//                     paymentMethods._id.toString() === req.body.payment_id
//             );
//             console.log('indx=' + indx);

//             return await editCharityProfilePaymentMethods(
//                 req,
//                 res,
//                 next,
//                 indx,
//                 'bankAccount'
//             );
//         } else if (fawry) {
//             console.log('ff');
//             let indx = req.charity.paymentMethods.fawry.findIndex(
//                 (paymentMethods) =>
//                     paymentMethods._id.toString() === req.body.payment_id
//             );
//             console.log('indx=' + indx);
//             return await editCharityProfilePaymentMethods(
//                 req,
//                 res,
//                 next,
//                 indx,
//                 'fawry'
//             );
//         } else if (vodafoneCash) {
//             let indx = req.charity.paymentMethods.vodafoneCash.findIndex(
//                 (paymentMethods) =>
//                     paymentMethods._id.toString() === req.body.payment_id
//             );
//             console.log('indx=' + indx);
//             return await editCharityProfilePaymentMethods(
//                 req,
//                 res,
//                 next,
//                 indx,
//                 'vodafoneCash'
//             );
//         }
//         // console.log(req);
//         // console.log(req.body);
//         // for (const [key, valueObj] of Object.entries(req.body)) {

//         //   console.log('--');
//         //   console.log(key);
//         //   console.log(valueObj);
//         //   if (typeof valueObj === 'object') {
//         //     for (const [subKey, val] of Object.entries(valueObj)) {
//         //       if (!isNaN(subKey)) {
//         //         console.log('arr of objects'); //for location
//         //         charity[key][subKey] = { val };
//         //       } else {
//         //         console.log('an obj');
//         //       }

//         //       // console.log(typeof subKey);
//         //       console.log(val);
//         //       charity[key][subKey] = val;
//         //     }
//         //   } else {
//         //     // If the value is not an object, assign it directly
//         //     charity[key] = valueObj;
//         //   }
//         // }
//         res.json(req.body);
//     }
// );

const logout = (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  return { message: 'logout' };
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
  const dataResponsed = await charityService.sendDocs(data, storedCharity);
  return {
    paymentMethods: dataResponsed.paymentMethods,
    message: dataResponsed.message,
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
  // requestEditCharityProfilePayments,
  // addCharityPayments,
};
