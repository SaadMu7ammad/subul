import { charityService } from './charity.service.js';
import { DataForActivateCharityAccount, CharityDocs, CharityDocument, CharityPaymentMethod, DataForConfirmResetPassword,DataForEditCharityProfile, DataForRequestResetPassword, DataForChangePassword, DataForChangeProfileImage, DataForRequestEditCharityPayments, DataForSendDocs} from '../data-access/interfaces/charity.interface.js';

const activateCharityAccount = async (req, res, next) => {
  let storedCharity:CharityDocument = req.charity;

  const { token } :DataForActivateCharityAccount= req.body;

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

const requestResetPassword = async (req, res, next) => {
  const { email }:DataForRequestResetPassword= req.body;

  const data = {
    email,
  };
  
  const requestResetPasswordResponse =
    await charityService.requestResetPassword(data);

  return {
    message: requestResetPasswordResponse.message,
  };
};

const confirmResetPassword = async (req, res, next) => {
  const { token, email, password }:DataForConfirmResetPassword = req.body;
  
  const data = {
    token,
    email,
    password,
  };

  const confirmResetPasswordResponse =
    await charityService.confirmResetPassword(data);

  return { message: confirmResetPasswordResponse.message };
};

const changePassword = async (req, res, next) => {
  const data:DataForChangePassword ={password:req.body.password} ;

  const storedCharity:CharityDocument = req.charity;

  const changePasswordResponse = await charityService.changePassword(
    data,
    storedCharity
  );

  return { message: changePasswordResponse.message };
};
const showCharityProfile = (req, res, next) => {
  const storedCharity:CharityDocument = req.charity;

  const responseData = charityService.getCharityProfileData(storedCharity);

  return {
    charity: responseData.charity,
  };
};
const editCharityProfile = async (req, res, next) => {
const data:DataForEditCharityProfile= {
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    locationId: req.body.locationId,
    contactInfo: req.body.contactInfo,
    description: req.body.description,
  };

  const storedCharity:CharityDocument = req.charity;

  const responseData = await charityService.editCharityProfile(
    data,
    storedCharity
  );

  return {
    charity: responseData.charity,
    message: responseData.message,
  };
};
const changeProfileImage = async (req, res, next) => {
  const data:DataForChangeProfileImage = {
    image: req.body.image[0],
  };
  const storedCharity:CharityDocument = req.charity;
  const responseData = await charityService.changeProfileImage(
    data,
    storedCharity
  );
  return { image: responseData.image,message:responseData.message };
};

const requestEditCharityPayments = async (req, res, next) => {
    const data:DataForRequestEditCharityPayments = {
        paymentMethods: req.body.paymentMethods,
        paymentId: req.body.payment_id,
    }
    const responseData = await charityService.requestEditCharityPayments(
        req.charity,
        data.paymentId, 
        data.paymentMethods,
    );

    return {
        paymentMethod: responseData.paymentMethod,
        message: responseData.message,
    };
};


const logout = (req, res, next) => {
  const responseData = charityService.logoutCharity(res);
  return {
    message: responseData.message,
  };
};

const sendDocs = async (req, res, next) => {
  const data:DataForSendDocs= {
    charityDocs: {
      docs1: req.body.charityDocs.docs1,
      docs2: req.body.charityDocs.docs2,
      docs3: req.body.charityDocs.docs3,
      docs4: req.body.charityDocs.docs4,
    },
    paymentMethods: {
      bankAccount: req.body.paymentMethods['bankAccount'] , 
      fawry: req.body.paymentMethods['fawry'],
      vodafoneCash: req.body.paymentMethods['vodafoneCash'], 
    },
  };
  const storedCharity:CharityDocument = req.charity;
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
