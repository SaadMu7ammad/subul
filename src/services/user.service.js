import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import User from '../models/userModel.js';
import { generateResetTokenTemp, setupMailSender } from '../utils/mailer.js';

const checkUserPassword = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new NotFoundError('email not found');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return { isMatch: true, user: user };
};
const checkUserIsVerified = (user) => {
  if (user.emailVerification.isVerified) {
    return true; //user verified already
  }
  // const token = await generateResetTokenTemp();
  // user.verificationCode = token;
  // await user.save();
  // await setupMailSender(
  //   user.email,
  //   'login alert',
  //   'it seems that your account still not verified or activated please go to that link to activate the account ' +
  //     `<h3>(www.activate.com)</h3>` +
  //     `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  // );
  //not verified(not activated)
  return false;
};
const createUser = async (dataInputs) => {
  const userExist = await User.findOne({ email: dataInputs.email });
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await User.create(dataInputs);
  if (!user) throw new BadRequestError('Error created while creaing the user');
  return { user: user };
};
const checkUserIsExist = async (email) => {
  //return user if it exists
  const userIsExist = await User.findOne({ email: email });
  if (!userIsExist) {
    throw new NotFoundError('email not found Please use another one');
  }
  return {
    user: userIsExist,
  };
};
const logout = (res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
const getUser = (req) => {
  // const user = await User.findById(req.user._id).select(
  //   '-password -verificationCode'
  // );
  // if (!user) throw new NotFoundError('User not found');
  return { user: req.user };
};
const checkIsEmailDuplicated = async (email) => {
  const isDuplicatedEmail = await User.findOne({ email });
  if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const emailChangedAlert = async (email) => {
  //for sending email if changed or edited 
}

export const userService = {
  checkUserPassword,
  checkUserIsVerified,
  createUser,
  checkUserIsExist,
  logout,
  getUser,
  checkIsEmailDuplicated,
};
