import { RequestHandler } from 'express';

import { AuthCharity, CharityObject, authCharityService } from './auth.service';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public

export interface CharityData {
  email: string;
  password: string;
  name: string;
  phone: string;
  contactInfo: string;
  description: string;
  currency: string;
  location: string;
  charityInfo: string;
  image: string;
}

const registerCharity: RequestHandler = async (
  req,
  _res,
  _next
): Promise<{ charity: CharityObject }> => {
  // // const data: CharityData = req.body as CharityData;
  const {
    email,
    password,
    name,
    phone,
    contactInfo,
    description,
    currency,
    location,
    charityInfo,
    image: [firstImage],
  }: CharityData = req.body;

  const data: CharityData = {
    email,
    password,
    name,
    phone,
    contactInfo,
    description,
    currency,
    location,
    charityInfo,
    image: firstImage !== undefined ? firstImage : '', // [0]
  };
  // const data: CharityData = {
  //   email: req.body.email,
  //   password: req.body.password,
  //   name: req.body.name,
  //   phone: req.body.phone,
  //   contactInfo: req.body.contactInfo,
  //   description: req.body.description,
  //   currency: req.body.currency,
  //   location: req.body.location,
  //   charityInfo: req.body.charityInfo,
  //   image: req.body.image[0],
  // };

  const responseData = await authCharityService.registerCharity(data);

  const charityResponsed = {
    ...responseData.charity,
  };

  return {
    charity: {
      ...charityResponsed,
      // image: charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
    },
  };
};
export interface AuthCharityReturnedObject {
  charity: AuthCharity;
  message: string;
  token: string;
}

const authCharity: RequestHandler = async (req, res, _next) => {
  // Better to use different type for data here, not partial<CharityData>
  const { email, password }: { email: string; password: string } = req.body;
  const data = {
    email,
    password,
  };
  // const data = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };

  const responseData = await authCharityService.authCharity(data, res);

  const charityResponsed: AuthCharity = {
    ...responseData.charity,
  };

  //first stage check if it verified or not
  if (responseData.emailAlert) {
    //token sent to ur email
    return {
      charity: charityResponsed,
      message:
        'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
      token: responseData.token,
    };
  }
  const returnedObj: AuthCharityReturnedObject = {
    charity: charityResponsed,
    message: '',
    token: responseData.token,
  };
  //second stage
  //isPending = true and isConfirmed= false
  if (!charityResponsed.isConfirmed && charityResponsed.isPending) {
    returnedObj.message = 'charity docs will be reviewed';
  } //isPending = false and isConfirmed= false
  else if (!charityResponsed.isConfirmed && !charityResponsed.isPending) {
    returnedObj.message = 'you must upload docs to auth the charity';
    //isPending = false and isConfirmed= true
  } else if (charityResponsed.isConfirmed && !charityResponsed.isPending) {
    returnedObj.message = 'you are ready';
  }
  return returnedObj;
};

export const authUseCase = {
  registerCharity,
  authCharity,
};
