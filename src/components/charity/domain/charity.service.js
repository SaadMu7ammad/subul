import {
  BadRequestError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index.js';
import {
  checkValueEquality,
  updateNestedProperties,
  updateNestedPropertiesCharity,
} from '../../../utils/shared.js';
import { charityUtils } from './charity.utils.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';

const requestResetPassword = async (reqBody) => {
  const charityResponse = await charityUtils.checkCharityIsExist(reqBody.email);
  const token = await generateResetTokenTemp();
  await charityUtils.setTokenToCharity(charityResponse.charity, token);
  await setupMailSender(
    charityResponse.charity.email,
    'reset alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  return {
    charity: charityResponse.charity,
    message: 'email sent successfully to reset the password',
  };
};

const confirmResetPassword = async (reqBody) => {
  let updatedCharity = await charityUtils.checkCharityIsExist(reqBody.email);
  const isEqual = checkValueEquality(
    updatedCharity.charity.verificationCode,
    reqBody.token
  );
  if (!isEqual) {
    await charityUtils.resetSentToken(updatedCharity.charity);
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  await charityUtils.changeCharityPasswordWithMailAlert(
    updatedCharity.charity,
    reqBody.password
  );
  return { message: 'charity password changed successfully' };
};
const changePassword = async (password, charity) => {
  await charityUtils.changeCharityPasswordWithMailAlert(charity, password);
  return { message: 'Charity password changed successfully' };
};
const activateAccount = async (reqBody, charity, res) => {
  let storedCharity = charity;
  if (storedCharity.emailVerification.isVerified) {
    return { message: 'account already is activated' };
  }
  const isMatch = checkValueEquality(
    storedCharity.verificationCode,
    reqBody.token
  );
  if (!isMatch) {
    await charityUtils.resetSentToken(charity);
    charityUtils.logout(res);
    throw new UnauthenticatedError('invalid token you have been logged out');
  }
  await charityUtils.verifyCharityAccount(storedCharity);
  await setupMailSender(
    storedCharity.email,
    `hello ${storedCharity.name} charity ,your account has been activated successfully`,
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  return {
    message: 'account has been activated successfully',
  };
};
const logoutCharity = (res) => {
  charityUtils.logout(res);
  return { message: 'logout' };
};
const getCharityProfileData = (charity) => {
  return { charity: charity };
};
const editCharityProfile = async (reqBody, charity) => {
  if (!reqBody) throw new BadRequestError('no data sent');
  const { email, location, locationId } = reqBody;
  let storedCharity = charity;
  if (
    //put restriction on the edit elements
    !reqBody.name &&
    !reqBody.email &&
    !reqBody.location &&
    !reqBody.description &&
    !reqBody.contactInfo
  )
    throw new BadRequestError('cant edit that');
  const charityObj = {
    name: reqBody.name,
    // email: reqBody.email,
    // location: reqBody.location,
    contactInfo: reqBody.contactInfo,
    description: reqBody.description,
  };
  if (email) {
    const charityUpdated = await charityUtils.changeCharityEmailWithMailAlert(
      storedCharity,
      email
    );
    return {
      emailEdited: true,
      charity: charityUpdated.charity,
    };
  }
  if (location) {
    //edit
    if (locationId) {
      const charityUpdated = await charityUtils.editCharityProfileAddress(
        storedCharity,
        locationId,
        location
      );
      storedCharity = charityUpdated.charity;
    } else {
      const charityUpdated = await charityUtils.addCharityProfileAddress(
        storedCharity,
        location
      );
      storedCharity = charityUpdated.charity;
    }
  }
  updateNestedPropertiesCharity(storedCharity, charityObj);
  await storedCharity.save();
  return {
    emailEdited: false,
    charity: storedCharity,
  };
};
const changeProfileImage = async (reqBody, charity) => {
  const oldImg = charity.image;
  const newImg = reqBody.image;
  const updatedImg = await charityUtils.replaceProfileImage(charity,oldImg, newImg);
  return { image: updatedImg.image };
};
export const charityService = {
  requestResetPassword,
  confirmResetPassword,
  changePassword,
  activateAccount,
  logoutCharity,
  getCharityProfileData,
  editCharityProfile,
  changeProfileImage,
};
