import { charityService } from './charity.service.js';
import { CharityDocument, CharityPaymentMethodDocument } from '../data-access/interfaces/charity.interface.js';

const activateCharityAccount = async (req, res, next) => {
let storedCharity:CharityDocument = req.charity;
  const { token }:{token:string} = req.body;
  const data:{token:string} = {
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
  const { email }:{email:string} = req.body;
  const data :{email:string}= {
    email,
  };
  const requestResetPasswordResponse =
    await charityService.requestResetPassword(data);
  return {
    message: requestResetPasswordResponse.message,
  };
};

const confirmResetPassword = async (req, res, next) => {
  const { token, email, password }:{token:string,email:string,password:string} = req.body;
  const data = {
    token,
    email,
    password,
  };
  // let charity = await Charity.findOne({ email });
  // if (!charity) throw new NotFoundError('No charity found with this email');
  const confirmResetPasswordResponse =
    await charityService.confirmResetPassword(data);

  return { message: confirmResetPasswordResponse.message };
};

const changePassword = async (req, res, next) => {
  const { password }:{password:string} = req.body;
  const storedCharity:CharityDocument = req.charity;
  const changePasswordResponse = await charityService.changePassword(
    password,
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
const inputData:Partial<CharityDocument>&{locationId :string} = {
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    locationId: req.body.locationId,
    contactInfo: req.body.contactInfo,
    description: req.body.description,
  };
  const storedCharity:CharityDocument = req.charity;
  const responseData :{charity:CharityDocument,message:string}= await charityService.editCharityProfile(
    inputData,
    storedCharity
  );
  return {
    charity: responseData.charity,
    message: responseData.message,
  };
};
const changeProfileImage = async (req, res, next) => {
  const data:{image:string} = {
    image: req.body.image[0],
  };
  const storedCharity:CharityDocument = req.charity;
  const responseData:{image:string,message:string} = await charityService.changeProfileImage(
    data,
    storedCharity
  );
  return { image: responseData.image,message:responseData.message };
};

const requestEditCharityPayments = async (req, res, next) => {
    const reqPaymentMethodsObj:CharityPaymentMethodDocument = req.body.paymentMethods;
    const responseData = await charityService.requestEditCharityPayments(
        req.charity,
        req.body.payment_id,
        reqPaymentMethodsObj,
    );

    return {
        paymentMethod: responseData.paymentMethod,
        message: responseData.message,
    };
};


const logout = (req, res, next) => {
  const responseData:{message:string} = charityService.logoutCharity(res);
  return {
    message: responseData.message,
  };
};

const sendDocs = async (req, res, next) => {
  const data:{charityDocs:{docs1:string,docs2:string,docs3:string,docs4:string},paymentMethods:Partial<CharityPaymentMethodDocument>} = {
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
