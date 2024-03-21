import mongoose from 'mongoose';
import { ICharityLocationDocument,ICharityPaymentMethod,ICharityDocs} from './';

export interface DataForPaymentRequestsForConfirmedCharity {
    _id?: mongoose.Types.ObjectId;
    paymentMethods: ICharityPaymentMethod;
}

export interface DataForConfirmResetPassword {
    token: string;
    password: string;
    email: string;
}
export interface DataForEditCharityProfile {
    name: string;
    contactInfo: {
        email: string;
        phone: number;
        websiteUrl: string;
    };
    email: string;
    description: string;
    charityLocation: ICharityLocationDocument;
    locationId: string;
}
export interface DataForActivateCharityAccount {
    token: string;
}
export interface DataForRequestResetPassword {
    email: string;
}
export interface DataForChangePassword {
    password: string;
}
export interface DataForChangeProfileImage {
    image: string;
}
export interface DataForRequestEditCharityPayments {
    paymentMethods: ICharityPaymentMethod;
    paymentId: string;
}

export interface DataForSendDocs extends ICharityDocs {}