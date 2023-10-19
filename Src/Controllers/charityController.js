import Charity from '../models/charityModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import { setupMailSender, generateResetTokenTemp } from '../utils/mailer.js';
import dot from 'dot-object';

import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
// import logger from '../utils/logger.js';

const registerCharity = asyncHandler(async (req, res, next) => {
  // logger.info(req.file.path);
  // req.file.path=req.file.path.replace("\\","/")
  const { email } = req.body;

  let charity = await Charity.findOne({ email });
  if (charity) {
    throw new BadRequestError('An Account with this Email already exists');
  }

  charity = await Charity.create(req.body);
  if (!charity) throw new Error('Something went wrong');
  generateToken(res, charity._id, 'charity');
  await setupMailSender(
    req,
    'welcome alert',
    'Hi ' +
      charity.name +
      ' We are happy that you joined our community💚 ... keep spreading goodness with us'
  );
  res.status(201).json({
    _id: charity._id,
    name: charity.name,
    email,
    image: charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
  });
});

const authCharity = asyncHandler(async (req, res, next) => {
  //get email & password => checkthem
  //send activation token email if not activated
  //make a token ...
  const { email, password } = req.body;
  const charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  const isMatch = await charity.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalid password!');
  generateToken(res, charity._id, 'charity');
  //first stage
  if (
    !charity.emailVerification.isVerified ||
    !charity.phoneVerification.isVerified
  ) {
    //not verified(activated)
    const token = await generateResetTokenTemp();
    charity.verificationCode = token;
    await charity.save();
    await setupMailSender(
      req,
      'login alert',
      'it seems that your account still not verified or activated please go to that link to activate the account ' +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
  }
  //second stage
  //isPending = true and isConfirmed= false
  if (!charity.isConfirmed && charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'charity docs will be reviewed' },
    ]);
  } //isPending = false and isConfirmed= false
  else if (!charity.isConfirmed && !charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'you must upload docs to auth the charity' },
    ]);
    //isPending = false and isConfirmed= true
    //done
  } else if (charity.isConfirmed && !charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'you are ready' },
    ]);
  }
});

const activateCharityAccount = asyncHandler(async (req, res, next) => {
  let charity = await Charity.findById(req.charity._id);
  if (!charity) {
    throw new UnauthenticatedError(
      'you are not authorized to activate the account'
    );
  }
  if (charity.emailVerification.isVerified) {
    return res.status(200).json({ message: 'account already is activated' });
  }
  if (charity.verificationCode !== req.body.token) {
    charity.verificationCode = null;
    charity = await charity.save();
    // logoutUser(req, res, next);
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    // await setupMailSender(
    //   req,
    //   'account still not activated',
    //   '<h3>contact us if there is another issue about </h3>' );
    throw new UnauthenticatedError('invalid token you have been logged out');
  }

  charity.verificationCode = null;
  charity.emailVerification.isVerified = true;
  charity.emailVerification.verificationDate = Date.now();
  charity = await charity.save();
  await setupMailSender(
    req,
    'account has been activated ',
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  res.status(201).json({
    message: 'account has been activated successfully',
  });
});

const requestResetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  const token = await generateResetTokenTemp();
  await setupMailSender(
    req,
    'Password Reset Alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  charity.verificationCode = token;
  await charity.save();
  res.status(200).json({
    message: 'email sent successfully to reset the password',
  });
});

const confirmResetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { token, email } = req.body;
  let charity = await Charity.findOne({ email });
  if (!charity) throw new NotFoundError('No charity found with this email');
  if (charity.verificationCode !== token) {
    charity.verificationCode = null;
    charity = await charity.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  charity.verificationCode = null;
  charity.password = req.body.password;
  await charity.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(201).json({ message: 'charity password changed successfully' });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const charity = await Charity.findById(req.charity._id);
  charity.password = password;
  console.log(charity instanceof Charity);
  await charity.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(201).json({ message: 'Charity password changed successfully' });
});
const showCharityProfile = asyncHandler(async (req, res, next) => {
  const charity = await Charity.findById(req.charity._id).select(
    '-_id -password -verificationCode -emailVerification -phoneVerification -isEnabled -isConfirmed -isPending'
  );
  if (!charity) throw new NotFoundError('charity not found');
  res.status(201).json({
    charity,
    message: 'charity Data retrieved Successfully',
  });
});

const editCharityProfileAdresses = asyncHandler(
  async (req, res, next, indx) => {
    const tempLocation = {}; // Create a tempLocation object
    const { governorate, city, street } = { ...req.body.location[0] };
    if (indx !== -1) {
      console.log(req.body.location[0]);
      if (governorate) {
        // req.charity.location[indx].governorate = governorate;
        tempLocation.governorate = governorate;
      }
      console.log(city === ''); //true
      console.log(city === true); //false
      if (city) {
        // req.charity.location[indx].city = city;
        tempLocation.city = city;
      }
      if (street) {
        // req.charity.location[indx].street = street;
        tempLocation.street = street;
      }
      req.charity.location[indx] = tempLocation; //assign the object
      await req.charity.save();
      return res.json(req.charity.location[indx]);
    } else if (indx === -1 && (governorate || city || street)) {
      //add a new address

      if (governorate) {
        tempLocation.governorate = governorate;
      }
      if (city) {
        tempLocation.city = city;
      }
      if (street) {
        tempLocation.street = street;
      }
      req.charity.location.push(tempLocation); // Push the tempLocation object into the array
      await req.charity.save(); // Save the charity document
      const len = req.charity.location.length - 1;
      return res.json(req.charity.location[len]);
    }
  }
);
const editCharityProfile = asyncHandler(async (req, res, next) => {
  let charity = await Charity.findById(req.charity._id);
  console.log(req.body);

  const { location, currency } = req.body; // location: [ { governorate: 'Helwan' },{},.. ]
  // if (currency) throw new BadRequestError('cant change currency at this time');
  if (location) {
    //for editing location only
    let indx = req.charity.location.findIndex(
      (location) => location._id.toString() === req.body.location_id
    );
    return await editCharityProfileAdresses(req, res, next, indx);
  }
  if (currency) {
    console.log(currency[0]);
    let indx = req.charity.currency.find((it) => {
      console.log(it);
      if (it === currency[0]) {
        return res.json({ message: 'currency is exist' });
      }
    });
    req.charity.currency.push(currency[0]);
    await req.charity.save();
    const len = req.charity.currency.length - 1;
    return res.json(req.charity.currency[len]);
  }

  if (!charity) throw new NotFoundError('charity not found');
  for (const [key, valueObj] of Object.entries(req.body)) {
    if (key === 'paymentMethods' || key.split('.')[0] === 'paymentMethods')
      throw new BadRequestError(
        'Cant edit it,You must request to Change payment account or Add a new one'
      );
    if (key === 'charityDocs' || key.split('.')[0] === 'charityDocs')
      throw new BadRequestError('Cant edit it,You must contact us');
  }
  // for (const [key, valueObj] of Object.entries(req.body)) {

  //   if (key === 'paymentMethods'|| key.split('.')[0]==='paymentMethods')
  //     throw new BadRequestError(
  //       'Cant edit it,You must request to Change payment account or Add a new one'
  //     );
  //   console.log('--');
  //   console.log(key);
  //   console.log(valueObj);
  //   if (typeof valueObj === 'object') {
  //     for (const [subKey, val] of Object.entries(valueObj)) {
  //       if (!isNaN(subKey)) {
  //         console.log('arr of objects'); //for location
  //         charity[key][subKey] = { val };
  //       } else {
  //         console.log('an obj');
  //       }

  //       // console.log(typeof subKey);
  //       console.log(val);
  //       charity[key][subKey] = val;
  //     }
  //   } else {
  //     // If the value is not an object, assign it directly
  //     charity[key] = valueObj;
  //   }
  // }
  const updateCharityArgs = dot.dot(req.body);
  // console.log(updateCharityArgs);
  charity = await Charity.findByIdAndUpdate(
    req.charity._id,
    {
      $set: {
        ...updateCharityArgs,
      },
    },
    { new: true } // return the updated document after the changes have been applied.
  );
  await charity.save();
  res.status(201).json({
    _id: charity._id,
    name: charity.name,
    email: charity.email,
    message: 'charity Data Changed Successfully',
  });
});
const logout = asyncHandler((req, res, next) => {
  if (!req.cookies.jwt) throw new UnauthenticatedError('you are not logged in');

  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ message: 'Loggedout Successfully!' });
});

const sendDocs = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  // console.log('fsdfsadf');
  // Charity.schema.path('charityDocs').required(true)
  // await Charity.schema.save()

  const charity = await Charity.findById(req.charity._id);
  // console.log(charity);
  if (!charity) throw new NotFoundError('No charity found ');

  if (
    (charity.emailVerification.isVerified ||
      charity.phoneVerification.isVerified) &&
    !charity.isConfirmed &&
    !charity.isPending
  ) {
    charity.charityDocs = { ...req.body.charityDocs };
    // console.log({...req.body});
    charity.isPending = true;
    await charity.save();
    res.json([charity.charityDocs, { message: 'sent successfully' }]);
  } else if (
    !charity.emailVerification.isVerified ||
    !charity.phoneVerification.isVerified
  ) {
    throw new UnauthenticatedError('you must verify your account again');
  } else if (charity.isConfirmed) {
    throw new BadRequestError('you already has been confirmed');
  } else if (charity.isPending) {
    throw new BadRequestError('soon response... still reviewing docs');
  } else {
    throw new BadRequestError('error occured, try again later');
  }
});
export {
  registerCharity,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  confirmResetPasswordRequest,
  changePassword,
  logout,
  sendDocs,
  editCharityProfile,
  showCharityProfile,
};
