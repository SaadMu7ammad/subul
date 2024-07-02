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
  ICharityPaymentMethods,
  IRequestPaymentCharityDocumentResponse,
  charityServiceSkeleton,
} from '@components/charity/data-access/interfaces';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '@libs/errors/components/index';
import { generateResetTokenTemp, sendResetPasswordEmail, setupMailSender } from '@utils/mailer';
import { checkValueEquality, updateNestedProperties } from '@utils/shared';
import { Response } from 'express';

import { charityUtilsClass } from './charity.utils';

export class charityServiceClass implements charityServiceSkeleton {
  charityUtils: charityUtilsClass;

  constructor() {
    this.charityUtils = new charityUtilsClass();
    this.requestResetPassword = this.requestResetPassword.bind(this);
    this.confirmResetPassword = this.confirmResetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.activateAccount = this.activateAccount.bind(this);
    this.logoutCharity = this.logoutCharity.bind(this);
    this.getCharityProfileData = this.getCharityProfileData.bind(this);
    this.editCharityProfile = this.editCharityProfile.bind(this);
    this.changeProfileImage = this.changeProfileImage.bind(this);
    this.sendDocs = this.sendDocs.bind(this);
    this.requestEditCharityPayments = this.requestEditCharityPayments.bind(this);
  }
  async requestResetPassword(
    reqBody: DataForRequestResetPassword
  ): Promise<{ charity: ICharity; message: string }> {
    const charityResponse = await this.charityUtils.checkCharityIsExist(reqBody.email);
    const token = await generateResetTokenTemp();
    await this.charityUtils.setTokenToCharity(charityResponse.charity, token);
    // await setupMailSender(
    //   charityResponse.charity.email,
    //   'reset alert',
    //   'go to that link to reset the password (www.dummy.com) ' +
    //     `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    // );
    await sendResetPasswordEmail(reqBody.email, token);

    return {
      charity: charityResponse.charity,
      message: 'email sent successfully to reset the password',
    };
  }

  async confirmResetPassword(reqBody: DataForConfirmResetPassword): Promise<{ message: string }> {
    const updatedCharity = await this.charityUtils.checkCharityIsExist(reqBody.email);
    if (!updatedCharity.charity.verificationCode)
      throw new NotFoundError('verificationCode not found');
    const isEqual = checkValueEquality(updatedCharity.charity.verificationCode, reqBody.token);
    if (!isEqual) {
      await this.charityUtils.resetSentToken(updatedCharity.charity);
      throw new UnauthenticatedError('invalid token send request again to reset a password');
    }
    await this.charityUtils.changeCharityPasswordWithMailAlert(
      updatedCharity.charity,
      reqBody.password
    );
    return { message: 'charity password changed successfully' };
  }
  async changePassword(
    reqBody: DataForChangePassword,
    charity: ICharity
  ): Promise<{ message: string }> {
    await this.charityUtils.changeCharityPasswordWithMailAlert(charity, reqBody.password);
    return { message: 'Charity password changed successfully' };
  }
  async activateAccount(
    reqBody: DataForActivateCharityAccount,
    charity: ICharity,
    res: Response
  ): Promise<{ message: string }> {
    const storedCharity = charity;
    if (this.charityUtils.checkCharityVerification(storedCharity)) {
      throw new BadRequestError('account already is activated');
    }
    if (!storedCharity.verificationCode) throw new NotFoundError('verificationCode not found');
    const isMatch = checkValueEquality(storedCharity.verificationCode, reqBody.token);
    if (!isMatch) {
      await this.charityUtils.resetSentToken(charity);
      this.charityUtils.logout(res);
      throw new UnauthenticatedError('invalid token you have been logged out');
    }
    await this.charityUtils.verifyCharityAccount(storedCharity);
    await setupMailSender(
      storedCharity.email,
      `hello ${storedCharity.name} charity ,your account has been activated successfully`,
      `now you are ready to spread the goodness with us`
    );

    return {
      message: 'account has been activated successfully',
    };
  }
  logoutCharity(res: Response): { message: string } {
    this.charityUtils.logout(res);
    return { message: 'logout' };
  }
  getCharityProfileData(charity: ICharity) {
    return { charity: charity };
  }

  async editCharityProfile(
    reqBody: DataForEditCharityProfile,
    charity: ICharity
  ): Promise<{
    editedEmail: boolean;
    charity: ICharity;
    message: string;
  }> {
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
        await this.charityUtils.changeCharityEmailWithMailAlert(storedCharity, email)
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
          await this.charityUtils.editCharityProfileAddress(
            storedCharity,
            locationId,
            charityLocation
          )
        ).charity;
        storedCharity = updatedCharity;
      } else {
        const updatedCharity = await this.charityUtils.addCharityProfileAddress(
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
  }
  async changeProfileImage(
    reqBody: DataForChangeProfileImage,
    charity: ICharity
  ): Promise<{ image: string; message: string }> {
    const oldImg = charity.image;
    const newImg = reqBody.image;
    const updatedImg = (await this.charityUtils.replaceProfileImage(charity, oldImg, newImg)).image;
    return { image: updatedImg, message: 'image changed successfully' };
  }

  async sendDocs(
    reqBody: ICharityDocs,
    charity: ICharity
  ): Promise<{
    paymentMethods: ICharityPaymentMethods;
    message: string;
  }> {
    console.log({ ...reqBody });
    if (
      this.charityUtils.checkCharityVerification(charity) &&
      !charity.isConfirmed &&
      !charity.isPending
    ) {
      const addCharityPaymentsResponse = await this.charityUtils.addDocs(reqBody, charity);
      if (!addCharityPaymentsResponse.paymentMethods)
        throw new BadRequestError('failed to send the docs');
      return {
        paymentMethods: addCharityPaymentsResponse.paymentMethods,
        message: 'sent successfully',
      };
    } else if (!this.charityUtils.checkCharityVerification(charity)) {
      throw new UnauthenticatedError('you must verify your account again');
    } else if (charity.isConfirmed) {
      throw new BadRequestError('Charity is Confirmed already!');
    } else if (charity.isPending) {
      throw new BadRequestError('soon response... still reviewing docs');
    } else {
      throw new BadRequestError('error occurred, try again later');
    }
  }

  async requestEditCharityPayments(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<IRequestPaymentCharityDocumentResponse> {
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
        const isUpdated = await this.charityUtils.editBankAccount(
          storedCharity,
          reqPaymentMethodsObj
        );
        if (isUpdated) {
          paymentTypeSelected = 'bankAccount';
          edited = true;
          created = false;
        }
      } else if (reqPaymentMethodsObj.paymentMethods.fawry.number) {
        const isUpdated = await this.charityUtils.editFawryAccount(
          storedCharity,
          reqPaymentMethodsObj
        );
        if (isUpdated) {
          paymentTypeSelected = 'fawry';
          edited = true;
          created = false;
        }
      } else if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.number) {
        const isUpdated = await this.charityUtils.editVodafoneAccount(
          storedCharity,
          reqPaymentMethodsObj
        );

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
          await this.charityUtils.createBankAccount(storedCharity, reqPaymentMethodsObj);
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
        paymentMethods: reqPaymentMethodsObj.paymentMethods[`${paymentTypeSelected}`],
        message: `${paymentTypeSelected} Payment Method Has been ${
          edited ? 'edited' : created ? 'created' : ' '
        } Successfully!`,
      };
    } else {
      throw new BadRequestError('something went wrong .. try again');
    }
  }
}
// export const charityService = {
//   requestResetPassword,
//   confirmResetPassword,
//   changePassword,
//   activateAccount,
//   logoutCharity,
//   getCharityProfileData,
//   editCharityProfile,
//   changeProfileImage,
//   sendDocs,
//   requestEditCharityPayments,
// };
