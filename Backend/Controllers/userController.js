import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { User } from '../models/userModel.js';
import { generateResetTokenTemp, setupMailSender } from '../utils/mailer.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw new NotFoundError('email not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  generateToken(res, user._id);
  if (!user.emailVerification.isVerified) {
    //not verified(activated)
    const token = await generateResetTokenTemp();
    user.verificationCode = token;
    await user.save();
    await setupMailSender(
      req,
      'login alert',
      'it seems that your account still not verified or activated please go to that link to activate the account ' +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
  }
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});
//@desc   submit register page
//@route  POST /api/users/
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email: email });
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await User.create(req.body);
  if (user) {
    generateToken(res, user._id);
    await setupMailSender(
      req,
      'welcome alert',
      'hi ' +
        user.name.firstName +
        ' ' +
        user.name.lastName +
        ' we are happy that you joined our community ... keep spreading goodness with us'
    );
    res.status(201).json({
      _id: user._id,
      name,
      email,
    });
  } else {
    throw new BadRequestError('Invalid data');
  }
});
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = asyncHandler(async (req, res, next) => {
  const emailIsExist = await User.findOne({ email: req.body.email });
  if (!emailIsExist) {
    throw new Error('email not found Please use another one');
  }
  let user = emailIsExist;
  const token = await generateResetTokenTemp();
  await setupMailSender(
    req,
    'reset alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  // console.log('email sent successfully');
  user.verificationCode = token;
  await user.save();
  res
    .status(200)
    .json({ message: 'email sent successfully to reset the password' });
});
//@desc   reset password
//@route  POST /api/users/confirm
//@access public
const confrimReset = asyncHandler(async (req, res, next) => {
  const emailIsExist = await User.findOne({ email: req.body.email });
  if (!emailIsExist) {
    throw new Error('email not found Please use another one');
  }
  let updatedUser = emailIsExist;
  if (updatedUser.verificationCode !== req.body.token) {
    updatedUser.verificationCode = null;
    updatedUser = await updatedUser.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  updatedUser.password = req.body.password;
  updatedUser.verificationCode = null;
  updatedUser = await updatedUser.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(200).json({ message: 'user password changed successfully' });
});

//@desc   change password
//@route  POST /api/users/changepassword
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  const userIsExist = await User.findById(req.user._id);
  if (!userIsExist) {
    throw new Error('you are not authorized to change the password');
  }
  let updatedUser = userIsExist;
  updatedUser.password = req.body.password;
  updatedUser = await updatedUser.save();
  await setupMailSender(
    req,
    'password changed alert',
    '<h3>contact us if you did not changed the password</h3>' +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  res.status(200).json({ message: 'user password changed successfully' });
});

//@desc   activate account email
//@route  POST /api/users/activate
//@access private
const activateAccount = asyncHandler(async (req, res, next) => {
  const userIsExist = await User.findById(req.user._id);
  if (!userIsExist) {
    throw new Error('you are not authorized to activate the account');
  }
  if (userIsExist.emailVerification.isVerified) {
    return res.status(200).json({ message: 'account already is activated' });
  }
  let updatedUser = userIsExist;
  if (updatedUser.verificationCode !== req.body.token) {
    updatedUser.verificationCode = null;
    updatedUser = await updatedUser.save();
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

  updatedUser.verificationCode = null;
  updatedUser.emailVerification.isVerified = true;
  updatedUser.emailVerification.verificationDate = Date.now();
  updatedUser = await updatedUser.save();
  await setupMailSender(
    req,
    'account has been activated ',
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  res.status(200).json({ message: 'account has been activated successfully' });
});
//@desc   logout user
//@route  POST /api/users/logout
//@access public
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'logout' });
});

export {
  registerUser,
  authUser,
  logoutUser,
  resetUser,
  confrimReset,
  changePassword,
  activateAccount,
};
