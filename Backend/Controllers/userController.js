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
    throw new UnauthenticatedError('invalid token');
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

  res.status(200).json({ message: 'user changed successfully' });
});

//@desc   change password
//@route  POST /api/users/:id/changepassword
//@access private

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

export { registerUser, authUser, logoutUser, resetUser, confrimReset };
