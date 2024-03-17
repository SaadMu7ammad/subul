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
    DataForSendDocs,
    ICharityDocumentResponse,
    IPaymentCharityDocumentResponse,
} from '../data-access/interfaces/charity.interface';

const activateCharityAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<{ message: string }> => {
    let storedCharity: ICharityDocument = res.locals.charity;

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
    const data: DataForRequestResetPassword ={ email:req.body};

    const requestResetPasswordResponse =
        await charityService.requestResetPassword(data);

    return {
        message: requestResetPasswordResponse.message 
    };
};

const confirmResetPassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<{ message: string }> => {
    const data: DataForConfirmResetPassword ={ token:req.body.token, email:req.body.email, password:req.body.password};

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

    const storedCharity: ICharityDocument = res.locals.charity;

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
    const storedCharity: ICharityDocument = res.locals.charity;

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

    const storedCharity: ICharityDocument = res.locals.charity;

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
    const storedCharity: ICharityDocument = res.locals.charity;
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
): Promise<IPaymentCharityDocumentResponse> => {
    const data: DataForRequestEditCharityPayments = {
        paymentMethods: req.body.paymentMethods,
        paymentId: req.body.payment_id,
    };
    const responseData = await charityService.requestEditCharityPayments(
        res.locals.charity,
        data.paymentId,
        data.paymentMethods
    );

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
    const data: DataForSendDocs = {
        charityDocs: {
            docs1: req.body.charityDocs.docs1,
            docs2: req.body.charityDocs.docs2,
            docs3: req.body.charityDocs.docs3,
            docs4: req.body.charityDocs.docs4,
        },
        paymentMethods: {
            bankAccount: req.body.paymentMethods['bankAccount'],
            fawry: req.body.paymentMethods['fawry'],
            vodafoneCash: req.body.paymentMethods['vodafoneCash'],
        },
    };
    const storedCharity: ICharityDocument = res.locals.charity;
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
