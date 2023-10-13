import Charity from '../models/charityModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import { setupMailSender, generateResetTokenTemp } from '../utils/mailer.js';

import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import logger from '../utils/logger.js';

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
      { message: 'charity docs will be reviewed' }]
    );
  } //isPending = false and isConfirmed= false
  else if (!charity.isConfirmed && !charity.isPending) {
    res.status(200).json([
      {
        id: charity._id,
        email: charity.email,
        name: charity.name,
      },
      { message: 'you must upload docs to auth the charity' }]
    );
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

const logout = asyncHandler((req, res, next) => {
    if (!req.cookies.jwt)
        throw new UnauthenticatedError('you are not logged in');

    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true,
    });
    res.status(200).json({ message: 'Loggedout Successfully!' });
});
export {
    registerCharity,
    authCharity,
    activateCharityAccount,
    requestResetPassword,
    confirmResetPasswordRequest,
    changePassword,
    logout,
};
