import { NextFunction, Request, RequestHandler, Response } from 'express';
import { charityService } from './charity.service';
import {
    DataForActivateCharityAccount,
    ICharity,
    DataForConfirmResetPassword,
    DataForEditCharityProfile,
    DataForRequestResetPassword,
    DataForChangePassword,
    DataForChangeProfileImage,
    DataForRequestEditCharityPayments,
    ICharityDocs,
    IRequestPaymentCharityDocumentResponse
} from '../data-access/interfaces/';

const activateCharityAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ message: string }> => {
  let storedCharity: ICharity = res.locals.charity;

  const data: DataForActivateCharityAccount = { token: req.body.token };

  const activateCharityAccountResponse = await charityService.activateAccount(
    data,
    storedCharity,
    res
  );

  return {
    message: activateCharityAccountResponse.message,
  };
};

const requestResetPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ message: string }> => {
  const data: DataForRequestResetPassword = { email: req.body.email };

  const requestResetPasswordResponse =
    await charityService.requestResetPassword(data);

  return {
    message: requestResetPasswordResponse.message,
  };
};

const confirmResetPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ message: string }> => {
  const data: DataForConfirmResetPassword = {
    token: req.body.token,
    email: req.body.email,
    password: req.body.password,
  };

  const confirmResetPasswordResponse =
    await charityService.confirmResetPassword(data);

  return { message: confirmResetPasswordResponse.message };
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ message: string }> => {
  const data: DataForChangePassword = { password: req.body.password };

  const storedCharity: ICharity = res.locals.charity;

  const changePasswordResponse = await charityService.changePassword(
    data,
    storedCharity
  );

  return { message: changePasswordResponse.message };
};
const showCharityProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) : { charity: ICharity } => {
  const storedCharity: ICharity = res.locals.charity;

  const responseData = charityService.getCharityProfileData(storedCharity);

  return {
    charity: responseData.charity,
  };
};
const editCharityProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ charity: ICharity; message: string }> => {
  const data: DataForEditCharityProfile = {
    name: req.body.name,
    email: req.body.email,
    charityLocation: req.body.location,
    locationId: req.body.locationId,
    contactInfo: req.body.contactInfo,
    description: req.body.description,
  };

  const storedCharity: ICharity = res.locals.charity;

  const responseData = await charityService.editCharityProfile(
    data,
    storedCharity
  );

  return {
    charity: responseData.charity,
    message: responseData.message,
  };
};
const changeProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ image: string; message: string }> => {
  const data: DataForChangeProfileImage = {
    image: req.body.image[0],
  };
  const storedCharity: ICharity = res.locals.charity;
  const responseData = await charityService.changeProfileImage(
    data,
    storedCharity
  );
  return { image: responseData.image, message: responseData.message };
};

const requestEditCharityPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<IRequestPaymentCharityDocumentResponse> => {
    const data: DataForRequestEditCharityPayments = {
        paymentMethods: req.body.paymentMethods,
        paymentId: req.body.payment_id,
    };
    const storedCharity = res.locals.charity
    const responseData = await charityService.requestEditCharityPayments(storedCharity,data);
    return {
        paymentMethods: responseData.paymentMethods,
        message: responseData.message,
    };
};

const logout: RequestHandler = (req, res, next): { message: string } => {
  const responseData = charityService.logoutCharity(res);
  return {
    message: responseData.message,
  };
};

const sendDocs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data: ICharityDocs = req.body

    const storedCharity: ICharity= res.locals.charity

    const responseData = await charityService.sendDocs(data, storedCharity);
    return {
        paymentMethods: responseData.paymentMethods,
        message: responseData.message,
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
  requestEditCharityPayments,
};
