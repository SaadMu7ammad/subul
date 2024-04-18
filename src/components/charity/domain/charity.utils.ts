import { Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index';
import { CharityRepository } from '../data-access/charity.repository';
import { generateResetTokenTemp, setupMailSender } from '../../../utils/mailer';
import { checkValueEquality } from '../../../utils/shared';
import { deleteOldImgs } from '../../../utils/deleteFile';
import {
  ICharityDocument,
  ICharityPaymentMethodDocument,
  ICharityLocationDocument,
  // ICharityPaymentMethod,
  PaymentMethodNames,
  // RequestPaymentMethodsObject,
  // TypeWithAtLeastOneProperty,
  IDataForSendDocs,
  DataForRequestEditCharityPayments,
} from '../data-access/interfaces/charity.interface';
const charityRepository = new CharityRepository();
const checkCharityIsExist = async (
  email: string
): Promise<{ charity: ICharityDocument }> => {
  //return charity if it exists
  const charityIsExist: ICharityDocument | null =
    await charityRepository.findCharity(email);
  if (!charityIsExist) {
    throw new NotFoundError('email not found Please use another one');
  }
  return {
    charity: charityIsExist,
  };
};
const logout = (res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
const getCharity = (res: Response): { charity: ICharityDocument } => {
  return { charity: res.locals.charity };
};
const checkIsEmailDuplicated = async (email: string): Promise<void> => {
  const isDuplicatedEmail: ICharityDocument | null =
    await charityRepository.findCharity(email);
  if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const changeCharityEmailWithMailAlert = async (
  CharityBeforeUpdate: ICharityDocument,
  newEmail: string
): Promise<{ charity: ICharityDocument }> => {
  //for sending email if changed or edited
  CharityBeforeUpdate.email = newEmail;
  CharityBeforeUpdate.emailVerification.isVerified = false;
  CharityBeforeUpdate.emailVerification.verificationDate = null;
  const token: string = await generateResetTokenTemp();
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
const verifyCharityAccount = async (
  charity: ICharityDocument
): Promise<void> => {
  charity.verificationCode = null;
  charity.emailVerification.isVerified = true;
  charity.emailVerification.verificationDate = Date.now();
  await charity.save();
};
const resetSentToken = async (charity: ICharityDocument): Promise<void> => {
  charity.verificationCode = null;
  await charity.save();
};
const setTokenToCharity = async (
  charity: ICharityDocument,
  token: string
): Promise<void> => {
  charity.verificationCode = token;
  await charity.save();
};
const changePassword = async (
  charity: ICharityDocument,
  newPassword: string
): Promise<void> => {
  charity.password = newPassword;
  await charity.save();
};
const changeCharityPasswordWithMailAlert = async (
  charity: ICharityDocument,
  newPassword: string
): Promise<void> => {
  await changePassword(charity, newPassword);
  await resetSentToken(charity); //after saving and changing the password
  await setupMailSender(
    charity.email,
    'password changed alert',
    `hi ${charity.name} <h3>contact us if you did not changed the password</h3>` +
    `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );
};
const editCharityProfileAddress = async (
  charity: ICharityDocument,
  id: string,
  updatedLocation: ICharityLocationDocument
): Promise<{ charity: ICharityDocument }> => {
  //TODO: Should we use Partial<CharityLocationDocument>?
  for (let i = 0; i < charity.charityLocation.length; i++) {
    if (charity.charityLocation[i]) {
      const location = charity.charityLocation[i]!;
      const isMatch: boolean = checkValueEquality(location._id, id);
      if (isMatch) {
        // location = updatedLocation;//make a new id
        const { governorate, city, street } = updatedLocation; //🤔 IDK how it was working without the idx [i] ?
        governorate ? (location.governorate = governorate) : null;
        city ? (location.city = city) : null;
        street ? (location.street = street) : null;
        await charity.save();
        return { charity: charity };
      }
    }
  } //not match any location id
  throw new BadRequestError('no id found');
};
// };
const addCharityProfileAddress = async (
  charity: ICharityDocument,
  updatedLocation: ICharityLocationDocument
): Promise<{ charity: ICharityDocument }> => {
  charity.charityLocation.push(updatedLocation);
  await charity.save();
  return { charity: charity };
};

const replaceProfileImage = async (
  charity: ICharityDocument,
  oldImg: string,
  newImg: string
): Promise<{ image: string }> => {
  charity.image = newImg;
  console.log(oldImg);
  await charity.save();
  deleteOldImgs('charityLogos', oldImg);
  return { image: charity.image };
};
const addDocs = async (
  reqBody: IDataForSendDocs,
  charity: ICharityDocument
): Promise<{ paymentMethods: ICharityPaymentMethodDocument }> => {
  charity.charityDocs = { ...reqBody.charityDocs }; //assign the doc

  if (!reqBody || !reqBody.paymentMethods) {
    throw new BadRequestError(
      'must send one of payment gateways information..'
    );
  }
  if (reqBody.paymentMethods.bankAccount && reqBody.paymentMethods.bankAccount?.bankDocs.length > 0)
    await addPaymentAccounts(reqBody, charity, 'bankAccount');
  if (reqBody.paymentMethods.fawry && reqBody.paymentMethods.fawry.fawryDocs.length > 0)
    await addPaymentAccounts(reqBody, charity, 'fawry');
  if (reqBody.paymentMethods.vodafoneCash && reqBody.paymentMethods.vodafoneCash.vodafoneCashDocs.length > 0)
    await addPaymentAccounts(reqBody, charity, 'vodafoneCash');
  await makeCharityIsPending(charity); // update and save changes
  console.log(charity.paymentMethods);
  return {
    paymentMethods: charity.paymentMethods!,
  }; //Compiler Can't infer that paymentMethods are set to the charity , paymentMethods are not Possibly undefined any more 👍️
};
const makeCharityIsPending = async (
  charity: ICharityDocument
): Promise<void> => {
  charity.isPending = true;
  await charity.save();
};
const addPaymentAccounts = async (
  accountObj: IDataForSendDocs,
  charity: ICharityDocument,
  type: string
): Promise<void> => {
  if (charity.paymentMethods === undefined)
    charity.paymentMethods = {} as ICharityPaymentMethodDocument;
  // console.log({ ...req.body.paymentMethods.fawry[0] });
  if (type === 'bankAccount') {
    const { bankAccount } = accountObj.paymentMethods;
    if (!bankAccount || bankAccount.bankDocs.length === 0) throw new BadRequestError('no account provided');
    const { accNumber, iban, swiftCode } = bankAccount;

    const _bankDocs = [...bankAccount.bankDocs];
    if (accNumber != '' && iban != '' && swiftCode != '' && _bankDocs && accountObj?.paymentMethods?.bankAccount && accountObj?.paymentMethods?.bankAccount?.bankDocs?.length > 0) {
      charity.paymentMethods['bankAccount'].push(accountObj.paymentMethods.bankAccount);
    } else {
      throw new BadRequestError('must provide complete information');
    }
  }
  if (type === 'fawry') {
    const { fawry } = accountObj.paymentMethods;
    if (!fawry || fawry.fawryDocs.length === 0) throw new BadRequestError('no account provided');
    const { number } = fawry
    const _fawryDocs = [...fawry.fawryDocs];
    if (number != '' && _fawryDocs) {
      const temp: {
        number: string;
        fawryDocs: string[]; // Ensure fawryDocs is an array of strings
      } = {
        number: number,
        fawryDocs: _fawryDocs, // An array of strings
      };
      charity.paymentMethods['fawry'].push(temp);
    } else {
      throw new BadRequestError('must provide complete information');
    }
  }
  if (type === 'vodafoneCash') {
    const { vodafoneCash } = accountObj.paymentMethods;
    if (!vodafoneCash || vodafoneCash.vodafoneCashDocs.length === 0) throw new BadRequestError('no account provided');
    const { number } = vodafoneCash;
    const _vodafoneCashDocs = [...vodafoneCash.vodafoneCashDocs];

    if (number != '' && _vodafoneCashDocs) {
      const temp: {
        number: string;
        vodafoneCashDocs: string[]; // Ensure vodafoneCashDocs is an array of strings
      } = {
        number: number,
        vodafoneCashDocs: _vodafoneCashDocs, // An array of strings
      };
      charity.paymentMethods['vodafoneCash'].push(temp);
    } else {
      throw new BadRequestError('must provide complete information');
    }
  }
  await charity.save();
};

const getChangedPaymentMethod = (
  reqPaymentMethodsObj: ICharityPaymentMethodDocument
): PaymentMethodNames => {
  let changedPaymentMethod: PaymentMethodNames = 'bankAccount'; //it will be overwritten by the value in the request , so don't worry;
  let paymentMethods: PaymentMethodNames[] = [
    'bankAccount',
    'fawry',
    'vodafoneCash',
  ];
  paymentMethods.forEach((pm: PaymentMethodNames) => {
    if (reqPaymentMethodsObj[pm]) changedPaymentMethod = pm;
  });

  return changedPaymentMethod;
};

const editBankAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit')

  for (let [_, item] of storedCharity.paymentMethods.bankAccount.entries()) {
    console.log('1---------------');
    if (item._id.toString() === reqPaymentMethodsObj.paymentId.toString()) {
      console.log(item);
      item.enable = false;
      item.iban = reqPaymentMethodsObj.paymentMethods.bankAccount.iban
      item.accNumber = reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber
      item.swiftCode = reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode
      deleteOldImgs('charityDocs', item.bankDocs);
      item.bankDocs = reqPaymentMethodsObj.paymentMethods.bankAccount.bankDocs

      await storedCharity.save()
      return item;
    }
  }
}

const editFawryAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit')

  for (let [_, item] of storedCharity.paymentMethods.fawry.entries()) {
    console.log('2---------------');
    if (item._id.toString() === reqPaymentMethodsObj.paymentId.toString()) {
      console.log(item);
      item.enable = false;
      item.number = reqPaymentMethodsObj.paymentMethods.fawry.number
      deleteOldImgs('charityDocs', item.fawryDocs);
      item.fawryDocs = reqPaymentMethodsObj.paymentMethods.fawry.fawryDocs

      await storedCharity.save()


      // break; // Exit the loop
      return item;

    }
  }
}

const editVodafoneAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit')

  for (let [_, item] of storedCharity.paymentMethods.vodafoneCash.entries()) {
    console.log('-3--------------');
    if (item._id.toString() === reqPaymentMethodsObj.paymentId.toString()) {
      console.log(item);
      item.enable = false;
      item.number = reqPaymentMethodsObj.paymentMethods.vodafoneCash.number
      deleteOldImgs('charityDocs', item.vodafoneCashDocs);
      item.vodafoneCashDocs = reqPaymentMethodsObj.paymentMethods.vodafoneCash.vodafoneCashDocs

      await storedCharity.save()



      // break; // Exit the loop
      return item;

    }
  }
}

const createBankAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create')

  storedCharity.paymentMethods.bankAccount.push(reqPaymentMethodsObj.paymentMethods.bankAccount)

  await storedCharity.save()
}
const createFawryAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create')

  storedCharity.paymentMethods.fawry.push(reqPaymentMethodsObj.paymentMethods.fawry)

  await storedCharity.save()
}
const createVodafoneAccount = async (storedCharity: ICharityDocument, reqPaymentMethodsObj: DataForRequestEditCharityPayments) => {
  if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create')

  storedCharity.paymentMethods.vodafoneCash.push(reqPaymentMethodsObj.paymentMethods.vodafoneCash)

  await storedCharity.save()
}

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
  getChangedPaymentMethod,
  editBankAccount,
  editFawryAccount,
  editVodafoneAccount,
  createBankAccount,
  createFawryAccount,
  createVodafoneAccount
};
