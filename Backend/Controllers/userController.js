// import { BadRequestError } from '../errors/bad-request.js';
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

//post /api/users/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: 'logout' });
});

//get /api/users/profile
//private>>needs token
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = { ...req.user._doc };
  res.status(200).json(user);
});

//put /api/users/profile
//private>>needs token
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  
  if (!user) throw new UnauthenticatedError('not found an id');
  
  user.name=req.body.name||user.name
  user.email = req.body.email || user.email
  if(req.body.password)  user.password = req.body.password
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});
export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
