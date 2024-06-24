import {
  DataForActivateCharityAccount,
  DataForChangePassword,
  DataForChangeProfileImage,
  DataForConfirmResetPassword,
  DataForEditCharityProfile,
  DataForRequestEditCharityPayments,
  DataForRequestResetPassword,
  ICharity,
  ICharityDocs,
  IRequestPaymentCharityDocumentResponse,
} from '@components/charity/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import { generateResetTokenTemp, setupMailSender } from '@utils/mailer';
import { checkValueEquality, updateNestedProperties } from '@utils/shared';
import { Response } from 'express';

import { charityUtils } from './charity.utils';

const requestResetPassword = async (reqBody: DataForRequestResetPassword) => {
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

const confirmResetPassword = async (
  reqBody: DataForConfirmResetPassword
): Promise<{ message: string }> => {
  let updatedCharity = await charityUtils.checkCharityIsExist(reqBody.email);
  if (!updatedCharity.charity.verificationCode)
    throw new NotFoundError('verificationCode not found');
  const isEqual = checkValueEquality(updatedCharity.charity.verificationCode, reqBody.token);
  if (!isEqual) {
    await charityUtils.resetSentToken(updatedCharity.charity);
    throw new UnauthenticatedError('invalid token send request again to reset a password');
  }
  await charityUtils.changeCharityPasswordWithMailAlert(updatedCharity.charity, reqBody.password);
  return { message: 'charity password changed successfully' };
};
const changePassword = async (
  reqBody: DataForChangePassword,
  charity: ICharity
): Promise<{ message: string }> => {
  await charityUtils.changeCharityPasswordWithMailAlert(charity, reqBody.password);
  return { message: 'Charity password changed successfully' };
};
const activateAccount = async (
  reqBody: DataForActivateCharityAccount,
  charity: ICharity,
  res: Response
): Promise<{ message: string }> => {
  let storedCharity = charity;
  if (charityUtils.checkCharityVerification(storedCharity)) {
    throw new BadRequestError('account already is activated');
  }
  if (!storedCharity.verificationCode) throw new NotFoundError('verificationCode not found');
  const isMatch = checkValueEquality(storedCharity.verificationCode, reqBody.token);
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
const logoutCharity = (res: Response): { message: string } => {
  charityUtils.logout(res);
  return { message: 'logout' };
};
const getCharityProfileData = (charity: ICharity) => {
  return { charity: charity };
};
const editCharityProfile = async (reqBody: DataForEditCharityProfile, charity: ICharity) => {
  if (!reqBody) throw new BadRequestError('no data sent');
  const { email, charityLocation, locationId } = reqBody;
  let storedCharity = charity;
  if (
    //put restriction on the edit elements
    !reqBody.name &&
    !reqBody.email &&
    !reqBody.charityLocation &&
    !reqBody.description &&
    !reqBody.contactInfo
  )
    throw new BadRequestError('cant edit that');
  const charityObj = {
    name: reqBody.name,
    contactInfo: reqBody.contactInfo,
    description: reqBody.description,
  };
  if (email) {
    const updatedCharity = (
      await charityUtils.changeCharityEmailWithMailAlert(storedCharity, email)
    ).charity;
    return {
      editedEmail: true,
      charity: updatedCharity,
      message: 'email has been sent to your gmail',
    };
  }
  if (charityLocation) {
    //edit
    if (locationId) {
      const updatedCharity = (
        await charityUtils.editCharityProfileAddress(storedCharity, locationId, charityLocation)
      ).charity;
      storedCharity = updatedCharity;
    } else {
      const updatedCharity = await charityUtils.addCharityProfileAddress(
        storedCharity,
        charityLocation
      );
      storedCharity = updatedCharity.charity;
    }
  }
  updateNestedProperties(storedCharity, charityObj);
  await storedCharity.save();
  return {
    editedEmail: false,
    charity: storedCharity,
    message: 'data changed successfully',
  };
};
const changeProfileImage = async (
  reqBody: DataForChangeProfileImage,
  charity: ICharity
): Promise<{ image: string; message: string }> => {
  const oldImg = charity.image;
  const newImg = reqBody.image;
  const updatedImg = (await charityUtils.replaceProfileImage(charity, oldImg, newImg)).image;
  return { image: updatedImg, message: 'image changed successfully' };
};
const sendDocs = async (reqBody: ICharityDocs, charity: ICharity) => {
  console.log({ ...reqBody });
  if (
    charityUtils.checkCharityVerification(charity) &&
    !charity.isConfirmed &&
    !charity.isPending
  ) {
    const addCharityPaymentsResponse = await charityUtils.addDocs(reqBody, charity);
    return {
      paymentMethods: addCharityPaymentsResponse.paymentMethods,
      message: 'sent successfully',
    };
  } else if (!charityUtils.checkCharityVerification(charity)) {
    throw new UnauthenticatedError('you must verify your account again');
  } else if (charity.isConfirmed) {
    throw new BadRequestError('Charity is Confirmed already!');
  } else if (charity.isPending) {
    throw new BadRequestError('soon response... still reviewing docs');
  } else {
    throw new BadRequestError('error occurred, try again later');
  }
};

const requestEditCharityPayments = async (
  storedCharity: ICharity,
  reqPaymentMethodsObj: DataForRequestEditCharityPayments
): Promise<IRequestPaymentCharityDocumentResponse> => {
  let created = false;
  let edited = false;

  type paymentType = 'bankAccount' | 'vodafoneCash' | 'fawry' | undefined;
  let paymentTypeSelected: paymentType;

  if (!reqPaymentMethodsObj) {
    throw new BadRequestError('Incomplete Data!');
  }
  if (!storedCharity.paymentMethods) {
    throw new BadRequestError('No Payment Methods Found!');
  }
  if (
    !(
      reqPaymentMethodsObj.paymentMethods.bankAccount.iban &&
      reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber &&
      reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode
    ) &&
    !reqPaymentMethodsObj.paymentMethods.fawry.number &&
    !reqPaymentMethodsObj.paymentMethods.vodafoneCash.number
  ) {
    throw new BadRequestError('Incomplete Data!');
  }

  if (reqPaymentMethodsObj.paymentId) {
    if (
      reqPaymentMethodsObj.paymentMethods.bankAccount.iban &&
      reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber &&
      reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode
    ) {
      const isUpdated = await charityUtils.editBankAccount(storedCharity, reqPaymentMethodsObj);
      if (isUpdated) {
        paymentTypeSelected = 'bankAccount';
        edited = true;
        created = false;
      }
    } else if (reqPaymentMethodsObj.paymentMethods.fawry.number) {
      const isUpdated = await charityUtils.editFawryAccount(storedCharity, reqPaymentMethodsObj);
      if (isUpdated) {
        paymentTypeSelected = 'fawry';
        edited = true;
        created = false;
      }
    } else if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.number) {
      const isUpdated = await charityUtils.editVodafoneAccount(storedCharity, reqPaymentMethodsObj);

      if (isUpdated) {
        paymentTypeSelected = 'vodafoneCash';
        edited = true;
        created = false;
      }
    }
  } else {
    if (reqPaymentMethodsObj.paymentMethods.bankAccount.bankDocs.length > 0) {
      if (
        reqPaymentMethodsObj.paymentMethods.bankAccount.iban &&
        reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber &&
        reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode
      ) {
        await charityUtils.createBankAccount(storedCharity, reqPaymentMethodsObj);
        paymentTypeSelected = 'bankAccount';
        edited = false;
        created = true;
      }
    } else if (reqPaymentMethodsObj.paymentMethods.fawry.fawryDocs.length > 0) {
      if (reqPaymentMethodsObj.paymentMethods.fawry.number) {
        paymentTypeSelected = 'fawry';
        edited = false;
        created = true;
      }
    } else if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.vodafoneCashDocs.length > 0) {
      if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.number) {
        paymentTypeSelected = 'vodafoneCash';
        edited = false;
        created = true;
      }
    }
  }
  if (edited !== created && paymentTypeSelected) {
    return {
      paymentMethods: reqPaymentMethodsObj.paymentMethods[paymentTypeSelected],
      message: `${paymentTypeSelected} Payment Method Has been ${
        edited ? 'edited' : created ? 'created' : ' '
      } Successfully!`,
    };
  } else {
    throw new BadRequestError('something went wrong .. try again');
  }
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
  sendDocs,
  requestEditCharityPayments,
};
