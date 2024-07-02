import CaseModel from '@components/case/data-access/models/case.model';
import {
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  DataForRequestEditCharityPayments,
  ICharity,
  ICharityDocs,
  ICharityLocation,
  ICharityPaymentMethods,
  IDataForSendDocs,
  PaymentMethodsNames,
  charityUtilsSkeleton,
} from '@components/charity/data-access/interfaces';
import CharityModel from '@components/charity/data-access/models/charity.model';
import { BadRequestError, NotFoundError } from '@libs/errors/components/index';
import { deleteOldImgs } from '@utils/deleteFile';
import { generateResetTokenTemp, sendReactivationEmail, setupMailSender } from '@utils/mailer';
import { checkValueEquality } from '@utils/shared';
import { Response } from 'express';

import { CHARITY } from './charity.class';

export class charityUtilsClass implements charityUtilsSkeleton {
  #charity: CHARITY;

  constructor() {
    this.#charity = new CHARITY();

    this.checkCharityIsExist = this.checkCharityIsExist.bind(this);
    this.checkCharityIsExistById = this.checkCharityIsExistById.bind(this);
    this.logout = this.logout.bind(this);
    this.getCharity = this.getCharity.bind(this);
    this.checkIsEmailDuplicated = this.checkIsEmailDuplicated.bind(this);
    this.changeCharityEmailWithMailAlert = this.changeCharityEmailWithMailAlert.bind(this);
    this.verifyCharityAccount = this.verifyCharityAccount.bind(this);
    this.resetSentToken = this.resetSentToken.bind(this);
    this.setTokenToCharity = this.setTokenToCharity.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeCharityPasswordWithMailAlert = this.changeCharityPasswordWithMailAlert.bind(this);
    this.editCharityProfileAddress = this.editCharityProfileAddress.bind(this);
    this.addCharityProfileAddress = this.addCharityProfileAddress.bind(this);
    this.replaceProfileImage = this.replaceProfileImage.bind(this);
    this.addDocs = this.addDocs.bind(this);
    this.makeCharityIsPending = this.makeCharityIsPending.bind(this);
    this.addPaymentAccounts = this.addPaymentAccounts.bind(this);
    this.getChangedPaymentMethod = this.getChangedPaymentMethod.bind(this);
    this.editBankAccount = this.editBankAccount.bind(this);
    this.editFawryAccount = this.editFawryAccount.bind(this);
    this.editVodafoneAccount = this.editVodafoneAccount.bind(this);
    this.createBankAccount = this.createBankAccount.bind(this);
    this.createFawryAccount = this.createFawryAccount.bind(this);
    this.createVodafoneAccount = this.createVodafoneAccount.bind(this);
    this.checkCharityVerification = this.checkCharityVerification.bind(this);
  }
  checkCharityIsExist = async (email: string): Promise<{ charity: ICharity }> => {
    //return charity if it exists
    const charityIsExist = await this.#charity.charityModel.findCharity(email);
    if (!charityIsExist) {
      throw new NotFoundError('email not found Please use another one');
    }
    return {
      charity: charityIsExist,
    };
  };

  checkCharityIsExistById = async (id: string): Promise<{ charity: ICharity }> => {
    //return charity if it exists
    const charityIsExist = await this.#charity.charityModel.findCharityById(id);
    if (!charityIsExist) {
      throw new NotFoundError('charity not found');
    }
    return {
      charity: charityIsExist,
    };
  };
  logout = (res: Response): void => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  };
  getCharity = (res: Response): { charity: ICharity } => {
    return { charity: res.locals.charity };
  };
  checkIsEmailDuplicated = async (email: string): Promise<void> => {
    const isDuplicatedEmail = await this.#charity.charityModel.findCharity(email);
    if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
  };
  changeCharityEmailWithMailAlert = async (
    CharityBeforeUpdate: ICharity,
    newEmail: string
  ): Promise<{ charity: ICharity }> => {
    //for sending email if changed or edited
    CharityBeforeUpdate.email = newEmail;
    if (CharityBeforeUpdate.emailVerification) {
      CharityBeforeUpdate.emailVerification.isVerified = false;
      CharityBeforeUpdate.emailVerification.verificationDate = '';
    }
    const token = await generateResetTokenTemp();
    CharityBeforeUpdate.verificationCode = token;
    await sendReactivationEmail(CharityBeforeUpdate.email, token);
    await CharityBeforeUpdate.save();
    return { charity: CharityBeforeUpdate };
  };
  verifyCharityAccount = async (charity: ICharity): Promise<void> => {
    if (charity.emailVerification) {
      charity.verificationCode = '';
      charity.emailVerification.isVerified = true;
      charity.emailVerification.verificationDate = Date.now().toString();
    }
    await charity.save();
  };
  resetSentToken = async (charity: ICharity): Promise<void> => {
    charity.verificationCode = '';
    await charity.save();
  };
  setTokenToCharity = async (charity: ICharity, token: string): Promise<void> => {
    charity.verificationCode = token;
    await charity.save();
  };
  changePassword = async (charity: ICharity, newPassword: string): Promise<void> => {
    charity.password = newPassword;
    await charity.save();
  };
  changeCharityPasswordWithMailAlert = async (
    charity: ICharity,
    newPassword: string
  ): Promise<void> => {
    await this.changePassword(charity, newPassword);
    await this.resetSentToken(charity); //after saving and changing the password
    await setupMailSender(
      charity.email,
      'password changed alert',
      `hi ${charity.name} <h3>contact us if you did not changed the password</h3>` +
        `<h3>go to link(www.dummy.com) to freeze your account</h3>`
    );
  };
  editCharityProfileAddress = async (
    charity: ICharity,
    id: string,
    updatedLocation: ICharityLocation
  ): Promise<{ charity: ICharity }> => {
    //TODO: Should we use Partial<CharityLocationDocument>?
    for (let i = 0; i < charity.charityLocation.length; i++) {
      if (charity.charityLocation[`${i}`]) {
        const location = charity.charityLocation[`${i}`]!;
        const isMatch: boolean = checkValueEquality(location._id!.toString(), id);
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
  addCharityProfileAddress = async (
    charity: ICharity,
    updatedLocation: ICharityLocation
  ): Promise<{ charity: ICharity }> => {
    charity.charityLocation.push(updatedLocation);
    await charity.save();
    return { charity: charity };
  };

  replaceProfileImage = async (
    charity: ICharity,
    oldImg: string,
    newImg: string
  ): Promise<{ image: string }> => {
    charity.image = newImg;
    console.log(oldImg);
    await charity.save();
    deleteOldImgs('charityLogos', oldImg);
    return { image: charity.image };
  };
  addDocs = async (
    reqBody: ICharityDocs,
    charity: ICharity
  ): Promise<{ paymentMethods: ICharityPaymentMethods | undefined }> => {
    charity.charityDocs = { ...reqBody.charityDocs }; //assign the doc

    if (!reqBody || !reqBody.paymentMethods) {
      throw new BadRequestError('must send one of payment gateways information..');
    }
    if (
      reqBody.paymentMethods.bankAccount &&
      reqBody.paymentMethods.bankAccount?.bankDocs.length > 0
    )
      await this.addPaymentAccounts(reqBody, charity, 'bankAccount');
    if (reqBody.paymentMethods.fawry && reqBody.paymentMethods.fawry.fawryDocs.length > 0)
      await this.addPaymentAccounts(reqBody, charity, 'fawry');
    if (
      reqBody.paymentMethods.vodafoneCash &&
      reqBody.paymentMethods.vodafoneCash.vodafoneCashDocs.length > 0
    )
      await this.addPaymentAccounts(reqBody, charity, 'vodafoneCash');
    await this.makeCharityIsPending(charity); // update and save changes
    console.log(charity.paymentMethods);
    return {
      paymentMethods: charity.paymentMethods,
    };
  };
  makeCharityIsPending = async (charity: ICharity): Promise<void> => {
    charity.isPending = true;
    await charity.save();
  };
  addPaymentAccounts = async (accountObj: IDataForSendDocs, charity: ICharity, type: string) => {
    if (charity.paymentMethods === undefined)
      charity.paymentMethods = {
        bankAccount: [],
        fawry: [],
        vodafoneCash: [],
      };
    // console.log({ ...req.body.paymentMethods.fawry[0] });
    if (type === 'bankAccount') {
      const { bankAccount } = accountObj.paymentMethods;
      if (!bankAccount || bankAccount.bankDocs.length === 0)
        throw new BadRequestError('no account provided');
      const { accNumber, iban, swiftCode } = bankAccount;

      const _bankDocs = [...bankAccount.bankDocs];
      if (
        accNumber != '' &&
        iban != '' &&
        swiftCode != '' &&
        _bankDocs &&
        accountObj?.paymentMethods?.bankAccount &&
        accountObj?.paymentMethods?.bankAccount?.bankDocs?.length > 0
      ) {
        charity.paymentMethods['bankAccount'].push(accountObj.paymentMethods.bankAccount);
      } else {
        throw new BadRequestError('must provide complete information');
      }
    }
    if (type === 'fawry') {
      const { fawry } = accountObj.paymentMethods;
      if (!fawry || fawry.fawryDocs.length === 0) throw new BadRequestError('no account provided');
      const { number } = fawry;
      const _fawryDocs = [...fawry.fawryDocs];
      if (number != '' && _fawryDocs) {
        const temp = {
          enable: false,
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
      if (!vodafoneCash || vodafoneCash.vodafoneCashDocs.length === 0)
        throw new BadRequestError('no account provided');
      const { number } = vodafoneCash;
      const _vodafoneCashDocs = [...vodafoneCash.vodafoneCashDocs];

      if (number != '' && _vodafoneCashDocs) {
        const temp = {
          enable: false,
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

  getChangedPaymentMethod = (reqPaymentMethodsObj: ICharityPaymentMethods): PaymentMethodsNames => {
    let changedPaymentMethod: PaymentMethodsNames = 'bankAccount'; //it will be overwritten by the value in the request , so don't worry;
    const paymentMethods: PaymentMethodsNames[] = ['bankAccount', 'fawry', 'vodafoneCash'];
    paymentMethods.forEach((pm: PaymentMethodsNames) => {
      if (reqPaymentMethodsObj[`${pm}`]) changedPaymentMethod = pm;
    });

    return changedPaymentMethod;
  };

  editBankAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodBankAccount | undefined> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit');

    for (const [_, item] of storedCharity.paymentMethods.bankAccount.entries()) {
      console.log('1---------------');

      if (item._id === reqPaymentMethodsObj.paymentId.toString()) {
        console.log(item);
        item.enable = false;
        item.iban = reqPaymentMethodsObj.paymentMethods.bankAccount.iban;
        item.accNumber = reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber;
        item.swiftCode = reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode;
        deleteOldImgs('charityDocs', item.bankDocs);
        item.bankDocs = reqPaymentMethodsObj.paymentMethods.bankAccount.bankDocs;

        await storedCharity.save();
        return item;
      }
    }
  };

  editFawryAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodFawry | undefined> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit');

    for (const [_, item] of storedCharity.paymentMethods.fawry.entries()) {
      console.log('2---------------');

      if (item._id === reqPaymentMethodsObj.paymentId.toString()) {
        console.log(item);
        item.enable = false;
        item.number = reqPaymentMethodsObj.paymentMethods.fawry.number;
        deleteOldImgs('charityDocs', item.fawryDocs);
        item.fawryDocs = reqPaymentMethodsObj.paymentMethods.fawry.fawryDocs;

        await storedCharity.save();

        // break; // Exit the loop
        return item;
      }
    }
  };

  editVodafoneAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodVodafoneCash | undefined> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to edit');

    for (const [_, item] of storedCharity.paymentMethods.vodafoneCash.entries()) {
      console.log('-3--------------');
      if (item._id === reqPaymentMethodsObj.paymentId.toString()) {
        console.log(item);
        item.enable = false;
        item.number = reqPaymentMethodsObj.paymentMethods.vodafoneCash.number;
        deleteOldImgs('charityDocs', item.vodafoneCashDocs);
        item.vodafoneCashDocs = reqPaymentMethodsObj.paymentMethods.vodafoneCash.vodafoneCashDocs;

        await storedCharity.save();

        // break; // Exit the loop
        return item;
      }
    }
  };

  createBankAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create');

    storedCharity.paymentMethods.bankAccount.push(reqPaymentMethodsObj.paymentMethods.bankAccount);

    await storedCharity.save();
  };
  createFawryAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create');

    storedCharity.paymentMethods.fawry.push(reqPaymentMethodsObj.paymentMethods.fawry);

    await storedCharity.save();
  };
  createVodafoneAccount = async (
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void> => {
    if (!storedCharity.paymentMethods) throw new BadRequestError('no payments to create');

    storedCharity.paymentMethods.vodafoneCash.push(
      reqPaymentMethodsObj.paymentMethods.vodafoneCash
    );

    await storedCharity.save();
  };

  checkCharityVerification = (charity: ICharity): boolean => {
    if (
      (charity.emailVerification && charity.emailVerification.isVerified) ||
      (charity.phoneVerification && charity.phoneVerification.isVerified)
    )
      return true;
    else return false;
  };

  // Update each charity's numberOfCases field with the calculated value every time a new case is created
  async updateNumberOfCases(charity: ICharity): Promise<void> {
    const numberOfCases = charity.cases.length;
    await CharityModel.updateOne({ _id: charity._id }, { numberOfCases });

    console.log('Charity has been updated with the correct numberOfCases');
  }

  async getTotalNumberOfDonorsAndDonationsIncome(): Promise<void> {
    const charities = await CharityModel.find().lean(); // Get all charity documents as plain JavaScript objects
    for (const charity of charities) {
      const cases = await CaseModel.find({ _id: { $in: charity.cases } }).select(
        'donationNumbers currentDonationAmount'
      );
      const totalNumberOfDonors = cases.reduce((sum, caseDoc) => sum + caseDoc.donationNumbers, 0);
      const totalDonationsIncome = cases.reduce(
        (sum, caseDoc) => sum + caseDoc.currentDonationAmount,
        0
      );

      await CharityModel.updateOne(
        { _id: charity._id },
        { totalNumberOfDonors, totalDonationsIncome }
      );
    }
    console.log('All charities have been updated with the correct totalNumberOfDonors');
  }
}

// export const charityUtils = {
//   checkCharityIsExist,
//   checkCharityIsExistById,
//   logout,
//   changeCharityPasswordWithMailAlert,
//   getCharity,
//   checkIsEmailDuplicated,
//   verifyCharityAccount,
//   resetSentToken,
//   setTokenToCharity,
//   changeCharityEmailWithMailAlert,
//   editCharityProfileAddress,
//   addCharityProfileAddress,
//   replaceProfileImage,
//   addDocs,
//   getChangedPaymentMethod,
//   editBankAccount,
//   editFawryAccount,
//   editVodafoneAccount,
//   createBankAccount,
//   createFawryAccount,
//   createVodafoneAccount,
//   checkCharityVerification,
//   updateNumberOfCases,
//   getTotalNumberOfDonorsAndDonationsIncome,
// };
