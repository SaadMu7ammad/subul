import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index.js';
import { charityRepository } from '../data-access/charity.repository.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';
import { checkValueEquality } from '../../../utils/shared.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';

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
  await charity.save();
};
const resetSentToken = async (charity) => {
  charity.verificationCode = null;
  charity = await charity.save();
};
const setTokenToCharity = async (charity, token) => {
  charity.verificationCode = token;
  charity = await charity.save();
};
const changeCharityPasswordWithMailAlert = async (charity, newPassword) => {
  charity.password = newPassword;
  await resetSentToken(charity); //after saving and changing the password
  await setupMailSender(
    charity.email,
    'password changed alert',
    `hi ${charity.name} <h3>contact us if you did not changed the password</h3>` +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );
};
const editCharityProfileAddress = async (charity, id, updatedLocation) => {
  for (let i = 0; i < charity.location.length; i++) {
    const isMatch = checkValueEquality(charity.location[i]._id, id);
    if (isMatch) {
      // charity.location[i] = updatedLocation;//make a new id
      const { governorate, city, street } = updatedLocation;
      governorate ? (charity.location[i].governorate = governorate) : null;
      city ? (charity.location[i].city = city) : null;
      street ? (charity.location[i].street = street) : null;
      await charity.save();
      return { charity: charity };
    }
  } //not match any location id
  throw new BadRequestError('no id found');
};
// };
const addCharityProfileAddress = async (charity, updatedLocation) => {
  charity.location.push(updatedLocation);
  await charity.save();
  return { charity: charity };
};

const replaceProfileImage = async (charity, oldImg, newImg) => {
  charity.image = newImg;
  console.log(oldImg);
  await charity.save();
  deleteOldImgs('LogoCharities', oldImg);
  return { image: charity.image };
};
const addDocs = async (reqBody, charity) => {
  // charity.isPending = true;
  charity.charityDocs = { ...reqBody.charityDocs }; //assign the docs
  console.log(reqBody);
  if (!reqBody.paymentMethods) {
    // deleteOldImgs('docsCharities', req.temp);
    throw new BadRequestError(
      'must send one of payment gateways inforamtions..'
    );
  }
  const { bankAccount, fawry, vodafoneCash } = reqBody.paymentMethods;

  if (charity.paymentMethods === undefined) charity.paymentMethods = {};

  console.log('-------------------');
  if (bankAccount) {
    const { accNumber, iban, swiftCode } = bankAccount[0];
    let docsBank = bankAccount.docsBank[0];
    let temp = {
      accNumber,
      iban,
      swiftCode,
      docsBank,
    };
    // console.log(temp);
    if (accNumber && iban && swiftCode && docsBank) {
      charity.paymentMethods['bankAccount'].push(temp);
    } else {
      console.log(req.temp);
      // deleteOldImgs('docsCharities', req.temp);
      throw new BadRequestError('must provide complete information');
    }
    // console.log(charity.paymentMethods);
  }
  if (fawry) {
    const { number } = fawry[0];
    let docsFawry = fawry.docsFawry[0];

    if (number && docsFawry) {
      const temp = {
        number,
        docsFawry,
      };
      charity.paymentMethods['fawry'].push(temp);
    } else {
      // deleteOldImgs('docsCharities', req.temp);

      throw new BadRequestError('must provide complete information');
    }
  }
  if (vodafoneCash) {
    const { number } = vodafoneCash[0];
    let docsVodafoneCash = vodafoneCash.docsVodafoneCash[0];

    if (number && docsVodafoneCash) {
      const temp = {
        number,
        docsVodafoneCash,
      };

      charity.paymentMethods['vodafoneCash'].push(temp);
    } else {
      // deleteOldImgs('docsCharities', req.temp);
      throw new BadRequestError('must provide complete information');
    }
  }
  // await charity.save()
  await charity.save();

  // res.json(req.body);

  return { paymentMethods: charity.paymentMethods };
};
export const charityUtils = {
  checkCharityIsExist,
  logout,
  changeCharityPasswordWithMailAlert,
  getCharity,
  checkIsEmailDuplicated,
  verifyCharityAccount,
  resetSentToken,
  setTokenToCharity,
  changeCharityEmailWithMailAlert,
  editCharityProfileAddress,
  addCharityProfileAddress,
  replaceProfileImage,
  addDocs,
};