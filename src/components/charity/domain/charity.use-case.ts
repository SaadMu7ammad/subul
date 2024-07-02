import {
  ActivateCharityAccountResponse,
  ChangePasswordResponse,
  ChangeProfileImageResponse,
  ConfirmResetPasswordResponse,
  DataForActivateCharityAccount,
  DataForChangePassword,
  DataForChangeProfileImage,
  DataForConfirmResetPassword,
  DataForEditCharityProfile,
  DataForRequestEditCharityPayments,
  DataForRequestResetPassword,
  EditCharityProfileResponse,
  ICharity,
  ICharityDocs,
  RequestEditCharityPaymentsResponse,
  RequestResetPasswordResponse,
  SendDocsResponse,
  ShowCharityProfileResponse,
  charityUseCaseSkeleton,
  logoutResponse,
} from '@components/charity/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { charityServiceClass } from './charity.service';

export class charityUseCaseClass implements charityUseCaseSkeleton {
  charityService: charityServiceClass;

  constructor() {
    this.charityService = new charityServiceClass();
    this.activateCharityAccount = this.activateCharityAccount.bind(this);
    this.requestResetPassword = this.requestResetPassword.bind(this);
    this.confirmResetPassword = this.confirmResetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.showCharityProfile = this.showCharityProfile.bind(this);
    this.editCharityProfile = this.editCharityProfile.bind(this);
    this.changeProfileImage = this.changeProfileImage.bind(this);
    this.requestEditCharityPayments = this.requestEditCharityPayments.bind(this);
    this.requestEditCharityPayments = this.requestEditCharityPayments.bind(this);
    this.sendDocs = this.sendDocs.bind(this);
    this.logout = this.logout.bind(this);
  }
  async activateCharityAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): ActivateCharityAccountResponse {
    const storedCharity: ICharity = res.locals.charity;

    const data: DataForActivateCharityAccount = { token: req.body.token };

    const activateCharityAccountResponse = await this.charityService.activateAccount(
      data,
      storedCharity,
      res
    );

    return {
      message: activateCharityAccountResponse.message,
    };
  }

  async requestResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): RequestResetPasswordResponse {
    const data: DataForRequestResetPassword = { email: req.body.email };

    const requestResetPasswordResponse = await this.charityService.requestResetPassword(data);

    return {
      message: requestResetPasswordResponse.message,
    };
  }

  async confirmResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): ConfirmResetPasswordResponse {
    const data: DataForConfirmResetPassword = {
      token: req.body.token,
      email: req.body.email,
      password: req.body.password,
    };

    const confirmResetPasswordResponse = await this.charityService.confirmResetPassword(data);

    return { message: confirmResetPasswordResponse.message };
  }

  async changePassword(req: Request, res: Response, next: NextFunction): ChangePasswordResponse {
    const data: DataForChangePassword = { password: req.body.password };

    const storedCharity: ICharity = res.locals.charity;

    const changePasswordResponse = await this.charityService.changePassword(data, storedCharity);

    return { message: changePasswordResponse.message };
  }
  showCharityProfile(req: Request, res: Response, next: NextFunction): ShowCharityProfileResponse {
    const storedCharity: ICharity = res.locals.charity;

    const responseData = this.charityService.getCharityProfileData(storedCharity);

    return {
      charity: responseData.charity,
    };
  }
  async editCharityProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): EditCharityProfileResponse {
    const data: DataForEditCharityProfile = {
      name: req.body.name,
      email: req.body.email,
      charityLocation: req.body.location,
      locationId: req.body.locationId,
      contactInfo: req.body.contactInfo,
      description: req.body.description,
    };

    const storedCharity: ICharity = res.locals.charity;

    const responseData = await this.charityService.editCharityProfile(data, storedCharity);

    return {
      charity: responseData.charity,
      message: responseData.message,
    };
  }
  async changeProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): ChangeProfileImageResponse {
    const data: DataForChangeProfileImage = {
      image: req.body.image[0],
    };
    const storedCharity: ICharity = res.locals.charity;
    const responseData = await this.charityService.changeProfileImage(data, storedCharity);
    return { image: responseData.image, message: responseData.message };
  }

  async requestEditCharityPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): RequestEditCharityPaymentsResponse {
    const data: DataForRequestEditCharityPayments = {
      paymentMethods: req.body.paymentMethods,
      paymentId: req.body.payment_id,
    };
    const storedCharity = res.locals.charity;
    const responseData = await this.charityService.requestEditCharityPayments(storedCharity, data);
    return {
      paymentMethods: responseData.paymentMethods,
      message: responseData.message,
    };
  }

  logout(req: Request, res: Response, next: NextFunction): logoutResponse {
    const responseData = this.charityService.logoutCharity(res);
    return {
      message: responseData.message,
    };
  }

  async sendDocs(req: Request, res: Response, next: NextFunction): SendDocsResponse {
    const data: ICharityDocs = req.body;

    const storedCharity: ICharity = res.locals.charity;

    const responseData = await this.charityService.sendDocs(data, storedCharity);
    return {
      paymentMethods: responseData.paymentMethods,
      message: responseData.message,
    };
  }
}
// export const charityUseCase = {
//   activateCharityAccount,
//   requestResetPassword,
//   confirmResetPassword,
//   logout,
//   changePassword,
//   changeProfileImage,
//   sendDocs,
//   editCharityProfile,
//   showCharityProfile,
//   requestEditCharityPayments,
// };
