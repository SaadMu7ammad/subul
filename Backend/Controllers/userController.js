// import { BadRequestError } from '../errors/bad-request.js';
import nodemailer from 'nodemailer';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { User } from '../models/userModel.js';
//post /api/users/auth
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
//post /api/users/
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email: email });
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await User.create(req.body);
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    throw new BadRequestError({ msg: 'Invalid data' });
  }
});

const resetUser = asyncHandler(async (req, res, next) => {
  const emailIsExist = await User.findOne({ email: req.body.email });
  if (!emailIsExist) {
    throw new Error('email not found Please use another one');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_KEY,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: req.body.email,
    subject: 'reset alert',
    html: 'go to that link to reset the password',
  };
  await transporter.sendMail(mailOptions);
  // console.log('email sent successfully');

  res.status(200).json({ msg: 'email sent successfully to reset the password' });
});

//post /api/users/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: 'logout' });
});

export { registerUser, authUser, logoutUser, resetUser };
