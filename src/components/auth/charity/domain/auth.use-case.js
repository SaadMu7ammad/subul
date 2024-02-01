import { BadRequestError } from '../../../../libraries/errors/components/index.js';
import { authCharityService } from './auth.service.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public
const registerCharity = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    contactInfo: req.body.contactInfo,
    description: req.body.description,
    currency: req.body.currency,
    location: req.body.location,
    charityInfo: req.body.charityInfo,
    image: req.body.image[0],
  };
  const dataResponsed = await authCharityService.registerCharity(data, res);
  const charityResponsed = {
    ...dataResponsed.charity,
  };
  return {
    charity: {
      ...charityResponsed,
      // image: charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
    },
  };
};

const authCharity = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const dataResponsed = await authCharityService.authCharity(data, res);
  const charityResponsed = {
    ...dataResponsed.charity,
  };
  //first stage check if it verified or not
  if (dataResponsed.emailAlert) {
    //token sent to ur email
    return {
      charity: charityResponsed,
      message:
        'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
    };
  }
  const returnedObj = {
    charity: charityResponsed,
    message: '',
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
