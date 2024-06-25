import {
  ActivateCharityAccountResponse,
  ChangePasswordResponse,
  ChangeProfileImageResponse,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
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
  ICharityLocation,
  ICharityPaymentMethods,
  IDataForSendDocs,
  IRequestPaymentCharityDocumentResponse,
  PaymentMethodsNames,
  RequestEditCharityPaymentsResponse,
  RequestResetPasswordResponse,
  SendDocsResponse,
  ShowCharityProfileResponse,
  logoutResponse,
} from '@components/charity/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

export interface CharityDao {
  findCharity: (email: string) => Promise<ICharity | null>;
  createCharity: (dataInputs: ICharity) => Promise<ICharity | null>;
  findCharityById: (id: string) => Promise<ICharity | null>;
}

export interface charityUtilsSkeleton {
  checkCharityIsExist(email: string): Promise<{ charity: ICharity }>;

  checkCharityIsExistById(id: string): Promise<{ charity: ICharity }>;

  logout(res: Response): void;

  getCharity(res: Response): { charity: ICharity };

  checkIsEmailDuplicated(email: string): Promise<void>;
  changeCharityEmailWithMailAlert(
    CharityBeforeUpdate: ICharity,
    newEmail: string
  ): Promise<{ charity: ICharity }>;
  verifyCharityAccount(charity: ICharity): Promise<void>;
  resetSentToken(charity: ICharity): Promise<void>;
  setTokenToCharity(charity: ICharity, token: string): Promise<void>;
  changePassword(charity: ICharity, newPassword: string): Promise<void>;
  changeCharityPasswordWithMailAlert(charity: ICharity, newPassword: string): Promise<void>;
  editCharityProfileAddress(
    charity: ICharity,
    id: string,
    updatedLocation: ICharityLocation
  ): Promise<{ charity: ICharity }>;
  // };
  addCharityProfileAddress(
    charity: ICharity,
    updatedLocation: ICharityLocation
  ): Promise<{ charity: ICharity }>;

  replaceProfileImage(
    charity: ICharity,
    oldImg: string,
    newImg: string
  ): Promise<{ image: string }>;

  addDocs(
    reqBody: ICharityDocs,
    charity: ICharity
  ): Promise<{ paymentMethods: ICharityPaymentMethods | undefined }>;

  makeCharityIsPending(charity: ICharity): Promise<void>;

  addPaymentAccounts(accountObj: IDataForSendDocs, charity: ICharity, type: string): Promise<void>;

  getChangedPaymentMethod(reqPaymentMethodsObj: ICharityPaymentMethods): PaymentMethodsNames;

  editBankAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodBankAccount | undefined>;

  editFawryAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodFawry | undefined>;
  editVodafoneAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<CharityPaymentMethodVodafoneCash | undefined>;
  createBankAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void>;
  createFawryAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void>;
  createVodafoneAccount(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<void>;
  checkCharityVerification(charity: ICharity): boolean;
}

export interface charityUseCaseSkeleton {
  activateCharityAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): ActivateCharityAccountResponse;

  requestResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): RequestResetPasswordResponse;

  confirmResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): ConfirmResetPasswordResponse;

  changePassword(req: Request, res: Response, next: NextFunction): ChangePasswordResponse;

  showCharityProfile(req: Request, res: Response, next: NextFunction): ShowCharityProfileResponse;

  editCharityProfile(req: Request, res: Response, next: NextFunction): EditCharityProfileResponse;

  changeProfileImage(req: Request, res: Response, next: NextFunction): ChangeProfileImageResponse;

  requestEditCharityPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): RequestEditCharityPaymentsResponse;

  logout(req: Request, res: Response, next: NextFunction): logoutResponse;

  sendDocs(req: Request, res: Response, next: NextFunction): SendDocsResponse;
}

export interface charityServiceSkeleton {
  requestResetPassword(
    reqBody: DataForRequestResetPassword
  ): Promise<{ charity: ICharity; message: string }>;

  confirmResetPassword(reqBody: DataForConfirmResetPassword): Promise<{ message: string }>;
  changePassword(reqBody: DataForChangePassword, charity: ICharity): Promise<{ message: string }>;
  activateAccount(
    reqBody: DataForActivateCharityAccount,
    charity: ICharity,
    res: Response
  ): Promise<{ message: string }>;
  logoutCharity(res: Response): { message: string };
  getCharityProfileData(charity: ICharity): { charity: ICharity };

  editCharityProfile(
    reqBody: DataForEditCharityProfile,
    charity: ICharity
  ): Promise<{
    editedEmail: boolean;
    charity: ICharity;
    message: string;
  }>;
  changeProfileImage(
    reqBody: DataForChangeProfileImage,
    charity: ICharity
  ): Promise<{ image: string; message: string }>;
  sendDocs(
    reqBody: ICharityDocs,
    charity: ICharity
  ): Promise<{
    paymentMethods: ICharityPaymentMethods;
    message: string;
  }>;
  requestEditCharityPayments(
    storedCharity: ICharity,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
  ): Promise<IRequestPaymentCharityDocumentResponse>;
}
