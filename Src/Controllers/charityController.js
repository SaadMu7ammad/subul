import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import Charity from '../models/charityModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import { setupMailSender, generateResetTokenTemp } from '../utils/mailer.js';
import multer from 'multer';
import sharp from 'sharp';
import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import logger from '../utils/logger.js';
//disk Storage solution
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, 'uploads/');
//     cb(null, './uploads/LogoCharities');
//   },
//   filename: function (req, file, cb) {
//     // const imageUrl = file.path.replace("\\", "/");
//     const ex = file.mimetype.split('/')[1];
//     const uniqueSuffix ="LogoCharity"+uuidv4()+"-"+ Date.now() ;
//     cb(null, uniqueSuffix + '.' + ex);
//   },
// });
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
const resizeImg = asyncHandler(async (req, res, next) => {
  // const ex = file.mimetype.split('/')[1];
  const uniqueSuffix = 'LogoCharity' + uuidv4() + '-' + Date.now();
  const filename = uniqueSuffix + '.jpeg';
  await sharp(req.file.buffer)
    .resize(320, 240)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile('./uploads/LogoCharities/' + filename, (err, info) => {
      console.log(err);
    });
  //adding the filename in the req.body
  req.body.image = filename;
  next();
});
//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadCoverImage = upload.single('image');

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
  if (!charity.emailVerification.isVerified) {
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
  res.status(200).json({
    id: charity._id,
    email: charity.email,
    name: charity.name,
  });
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
export {
  registerCharity,
  authCharity,
  activateCharityAccount,
  requestResetPassword,
  uploadCoverImage,
  resizeImg,
};
