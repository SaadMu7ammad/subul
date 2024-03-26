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
    DataForEditCharityProfile,
    DataForActivateCharityAccount,
    DataForRequestResetPassword,
    DataForConfirmResetPassword,
    DataForChangePassword,
    DataForChangeProfileImage,
    ICharityDocumentResponse,
    IPaymentCharityDocumentResponse,
    IDataForSendDocs,
    DataForRequestEditCharityPayments,
    IRequestPaymentCharityDocumentResponse,
} from '../data-access/interfaces/charity.interface';
import { Response } from 'express';

const requestResetPassword = async (
    reqBody: DataForRequestResetPassword
): Promise<ICharityDocumentResponse> => {
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

const confirmResetPassword = async (
    reqBody: DataForConfirmResetPassword
): Promise<{ message: string }> => {
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
): Promise<{ message: string }> => {
    await charityUtils.changeCharityPasswordWithMailAlert(
        charity,
        reqBody.password
    );
    return { message: 'Charity password changed successfully' };
};
const activateAccount = async (
    reqBody: DataForActivateCharityAccount,
    charity: ICharityDocument,
    res: Response
): Promise<{ message: string }> => {
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
        throw new UnauthenticatedError(
            'invalid token you have been logged out'
        );
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
const getCharityProfileData = (
    charity: ICharityDocument
): ICharityDocumentResponse => {
    return { charity: charity };
};
const editCharityProfile = async (
    reqBody: DataForEditCharityProfile,
    charity: ICharityDocument
): Promise<ICharityDocumentResponse> => {
    if (!reqBody) throw new BadRequestError('no data sent');
    const { email, charityLocation, locationId }: DataForEditCharityProfile =
        reqBody;
    let storedCharity: ICharityDocument = charity;
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
        // email: reqBody.email,
        // location: reqBody.location,
        contactInfo: reqBody.contactInfo,
        description: reqBody.description,
    };
    if (email) {
        const updatedCharity: { charity: ICharityDocument } =
            await charityUtils.changeCharityEmailWithMailAlert(
                storedCharity,
                email
            );
        return {
            emailEdited: true,
            charity: updatedCharity.charity,
            message: 'email has been sent to your gmail',
        };
    }
    if (charityLocation) {
        //edit
        if (locationId) {
            const updatedCharity: { charity: ICharityDocument } =
                await charityUtils.editCharityProfileAddress(
                    storedCharity,
                    locationId,
                    charityLocation
                );
            storedCharity = updatedCharity.charity;
        } else {
            const updatedCharity: { charity: ICharityDocument } =
                await charityUtils.addCharityProfileAddress(
                    storedCharity,
                    charityLocation
                );
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
): Promise<{ image: string; message: string }> => {
    const oldImg: string = charity.image;
    const newImg: string = reqBody.image;
    const updatedImg: { image: string } =
        await charityUtils.replaceProfileImage(charity, oldImg, newImg);
    return { image: updatedImg.image, message: 'image changed successfully' };
};
const sendDocs = async (
    reqBody: IDataForSendDocs,
    charity: ICharityDocument
): Promise<IPaymentCharityDocumentResponse> => {
    console.log({...reqBody});
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
    storedCharity: ICharityDocument,
    reqPaymentMethodsObj: DataForRequestEditCharityPayments
): Promise<IRequestPaymentCharityDocumentResponse> => {
    let created: boolean = false;
    let edited: boolean = false;
    
    type paymentType = 'bankAccount' | 'vodafoneCash' | 'fawry' | undefined
    let paymentTypeSelected: paymentType;

    if (!reqPaymentMethodsObj) {
        throw new BadRequestError('Incomplete Data!');
    }
    if (!storedCharity.paymentMethods) {
        throw new BadRequestError('No Payment Methods Found!');
    }
    if (!(reqPaymentMethodsObj.paymentMethods.bankAccount.iban && reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber && reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode)
        &&
        !(reqPaymentMethodsObj.paymentMethods.fawry.number)
        &&
        !(reqPaymentMethodsObj.paymentMethods.vodafoneCash.number)) {

        throw new BadRequestError('Incomplete Data!');
    }


    if (reqPaymentMethodsObj.paymentId) {
        if (reqPaymentMethodsObj.paymentMethods.bankAccount.iban && reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber && reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode) {
            const isUpdated = await charityUtils.editBankAccount(storedCharity, reqPaymentMethodsObj)
            if (isUpdated) {
                paymentTypeSelected = "bankAccount"
                edited = true;
                created = false
            }
        }
        else if (reqPaymentMethodsObj.paymentMethods.fawry.number) {
            const isUpdated = await charityUtils.editFawryAccount(storedCharity, reqPaymentMethodsObj)
            if (isUpdated) {
                paymentTypeSelected = "fawry"
                edited = true;
                created = false
            }

        }
        else if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.number) {
            const isUpdated = await charityUtils.editVodafoneAccount(storedCharity, reqPaymentMethodsObj)

            if (isUpdated) {
                paymentTypeSelected = "vodafoneCash"
                edited = true;
                created = false
            }

        }
    }
    else {
        if (reqPaymentMethodsObj.paymentMethods.bankAccount.bankDocs.length > 0) {
            if (reqPaymentMethodsObj.paymentMethods.bankAccount.iban && reqPaymentMethodsObj.paymentMethods.bankAccount.accNumber && reqPaymentMethodsObj.paymentMethods.bankAccount.swiftCode) {
                await charityUtils.createBankAccount(storedCharity, reqPaymentMethodsObj)
                paymentTypeSelected = "bankAccount"
                edited = false;
                created = true

            }

        }
        else if (reqPaymentMethodsObj.paymentMethods.fawry.fawryDocs.length > 0) {
            if (reqPaymentMethodsObj.paymentMethods.fawry.number) {
                paymentTypeSelected = "fawry"
                edited = false;
                created = true
            }

        } else if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.vodafoneCashDocs.length > 0) {
            if (reqPaymentMethodsObj.paymentMethods.vodafoneCash.number) {
                paymentTypeSelected = "vodafoneCash"
                edited = false;
                created = true
            }
        }
    }
    if (edited !== created && paymentTypeSelected) {
        return {
            paymentMethods: reqPaymentMethodsObj.paymentMethods[paymentTypeSelected],
            message: `${paymentTypeSelected} Payment Method Has been ${edited ? 'edited' : created ? 'created' : ' '} Successfully!`,
        };
    } else {
        throw new BadRequestError('something went wrong .. try again')
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
