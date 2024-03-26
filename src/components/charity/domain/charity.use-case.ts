import { NextFunction, Request, RequestHandler, Response } from 'express';

import { charityService } from './charity.service';
import {
    DataForActivateCharityAccount,
    ICharityDocument,
    DataForConfirmResetPassword,
    DataForEditCharityProfile,
    DataForRequestResetPassword,
    DataForChangePassword,
    DataForChangeProfileImage,
    DataForRequestEditCharityPayments,
    ICharityDocumentResponse,
    IPaymentCharityDocumentResponse,
    IDataForSendDocs,
    IRequestPaymentCharityDocumentResponse,
} from '../data-access/interfaces/charity.interface';

const activateCharityAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<{ message: string }> => {
    let storedCharity: ICharityDocument = res.locals.charity

    const { token }: DataForActivateCharityAccount = req.body;

    const data = {
        token,
    };

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
    const { email }: DataForRequestResetPassword = req.body;

    const data = {
        email,
    };

    const requestResetPasswordResponse =
        await charityService.requestResetPassword(data);

    return {
        message: requestResetPasswordResponse.message as string,
    };
};

const confirmResetPassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<{ message: string }> => {
    const { token, email, password }: DataForConfirmResetPassword = req.body;

    const data = {
        token,
        email,
        password,
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

    const storedCharity: ICharityDocument = res.locals.charity

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
): ICharityDocumentResponse => {
    const storedCharity: ICharityDocument = res.locals.charity

    const responseData = charityService.getCharityProfileData(storedCharity);

    return {
        charity: responseData.charity,
    };
};
const editCharityProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<ICharityDocumentResponse> => {
    const data: DataForEditCharityProfile = {
        name: req.body.name,
        email: req.body.email,
        charityLocation: req.body.location,
        locationId: req.body.locationId,
        contactInfo: req.body.contactInfo,
        description: req.body.description,
    };

    const storedCharity: ICharityDocument = res.locals.charity

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
    const storedCharity: ICharityDocument = res.locals.charity
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
): Promise<IPaymentCharityDocumentResponse> => {
    const data: IDataForSendDocs = req.body
    const storedCharity: ICharityDocument = res.locals.charity
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
