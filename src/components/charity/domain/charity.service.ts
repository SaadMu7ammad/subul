import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index';
import {
  checkValueEquality,
  updateNestedProperties,
} from '../../../utils/shared';
import { charityUtils } from './charity.utils';
import { generateResetTokenTemp, setupMailSender } from '../../../utils/mailer';
import {
  ICharityDocument,
  ICharityPaymentMethodDocument,
  ICharityPaymentMethod,
  DataForEditCharityProfile,
  DataForActivateCharityAccount,
  DataForRequestResetPassword,
  DataForConfirmResetPassword,
  DataForChangePassword,
  DataForChangeProfileImage,
  DataForSendDocs,
} from '../data-access/interfaces/charity.interface';

const requestResetPassword = async (reqBody: DataForRequestResetPassword) => {
  const charityResponse: { charity: ICharityDocument } =
    await charityUtils.checkCharityIsExist(reqBody.email);
  const token: string = await generateResetTokenTemp();
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

const confirmResetPassword = async (reqBody: DataForConfirmResetPassword) => {
  let updatedCharity: { charity: ICharityDocument } =
    await charityUtils.checkCharityIsExist(reqBody.email);
  if (!updatedCharity.charity.verificationCode)
    throw new NotFoundError('verificationCode not found');
  const isEqual: boolean = checkValueEquality(
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
const changePassword = async (
  reqBody: DataForChangePassword,
  charity: ICharityDocument
) => {
  await charityUtils.changeCharityPasswordWithMailAlert(
    charity,
    reqBody.password
  );
  return { message: 'Charity password changed successfully' };
};
const activateAccount = async (
  reqBody: DataForActivateCharityAccount,
  charity: ICharityDocument,
  res
) => {
  let storedCharity: ICharityDocument = charity;
  if (storedCharity.emailVerification.isVerified) {
    return { message: 'account already is activated' };
  }
  if (!storedCharity.verificationCode)
    throw new NotFoundError('verificationCode not found');
  const isMatch: boolean = checkValueEquality(
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
const getCharityProfileData = (charity: ICharityDocument) => {
  return { charity: charity };
};
const editCharityProfile = async (
  reqBody: DataForEditCharityProfile,
  charity: ICharityDocument
) => {
  if (!reqBody) throw new BadRequestError('no data sent');
  const { email, location, locationId }: DataForEditCharityProfile = reqBody;
  let storedCharity: ICharityDocument = charity;
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
    const updatedCharity: { charity: ICharityDocument } =
      await charityUtils.changeCharityEmailWithMailAlert(storedCharity, email);
    return {
      emailEdited: true,
      charity: updatedCharity.charity,
      message: 'email has been sent to your gmail',
    };
  }
  if (location) {
    //edit
    if (locationId) {
      const updatedCharity: { charity: ICharityDocument } =
        await charityUtils.editCharityProfileAddress(
          storedCharity,
          locationId,
          location
        );
      storedCharity = updatedCharity.charity;
    } else {
      const updatedCharity: { charity: ICharityDocument } =
        await charityUtils.addCharityProfileAddress(storedCharity, location);
      storedCharity = updatedCharity.charity;
    }
  }
  updateNestedProperties(storedCharity, charityObj);
  await storedCharity.save();
  return {
    emailEdited: false,
    charity: storedCharity,
    message: 'data changed successfully',
  };
};
const changeProfileImage = async (
  reqBody: DataForChangeProfileImage,
  charity: ICharityDocument
) => {
  const oldImg: string = charity.image;
  const newImg: string = reqBody.image;
  const updatedImg: { image: string } = await charityUtils.replaceProfileImage(
    charity,
    oldImg,
    newImg
  );
  return { image: updatedImg.image, message: 'image changed successfully' };
};
const sendDocs = async (
  reqBody: DataForSendDocs,
  charity: ICharityDocument
) => {
  if (
    (charity.emailVerification.isVerified ||
      charity.phoneVerification.isVerified) &&
    !charity.isConfirmed &&
    !charity.isPending
  ) {
    const addCharityPaymentsResponse: {
      paymentMethods: ICharityPaymentMethodDocument;
    } = await charityUtils.addDocs(reqBody, charity);
    return {
      paymentMethods: addCharityPaymentsResponse.paymentMethods,
      message: 'sent successfully',
    };
  } else if (
    !charity.emailVerification.isVerified &&
    !charity.phoneVerification.isVerified
  ) {
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
  charityObj: ICharityDocument,
  paymentId: string,
  reqPaymentMethodsObj: ICharityPaymentMethod
) => {
  if (!reqPaymentMethodsObj) {
    throw new BadRequestError('Incomplete Data!');
  }
  if (!charityObj.paymentMethods) {
    throw new BadRequestError('No Payment Methods Found!');
  }

  let charityPaymentMethodsObj: ICharityPaymentMethodDocument =
    charityObj.paymentMethods;

  let changedPaymentMethod: string =
    charityUtils.getChangedPaymentMethod(reqPaymentMethodsObj);

  const idx: number = charityUtils.getPaymentMethodIdx(
    charityPaymentMethodsObj,
    changedPaymentMethod,
    paymentId
  );

  const temp: ICharityPaymentMethod = charityUtils.makeTempPaymentObj(
    changedPaymentMethod,
    reqPaymentMethodsObj
  ); //👋

  if (idx !== -1) {
    charityUtils.swapPaymentInfo(
      charityPaymentMethodsObj,
      temp,
      changedPaymentMethod,
      idx
    );
  } else if (idx === -1) {
    charityUtils.addNewPayment(
      charityPaymentMethodsObj,
      temp,
      changedPaymentMethod
    );
  }

  await charityObj.save();

  const len: number =
    charityObj.paymentMethods[changedPaymentMethod].length - 1;

  return {
    paymentMethod: charityObj.paymentMethods[changedPaymentMethod][len],
    message: 'Payment Method Has been Added Successfully!',
  };
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
