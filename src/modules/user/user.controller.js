import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../../errors/index.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../../utils/generateToken.js';
import User from '../../models/userModel.js';
import { generateResetTokenTemp, setupMailSender } from '../../utils/mailer.js';
import logger from '../../utils/logger.js';
import dot from 'dot-object';
import { userUtils } from './user.utils.js';
import {
  checkValueEquality,
  updateNestedProperties,
} from '../../utils/shared.js';
import { userService } from './user.service.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public

const authUser = asyncHandler(async (req, res, next) => {
  // // if (req.cookies.jwt) throw new UnauthenticatedError('you are already logged in , logout first!');
  // const { email, password } = req.body;
  // const userResponse = await userUtils.checkUserPassword(email, password);

  // generateToken(res, userResponse.user._id, 'user');
  // // if (!authResponse.user.emailVerification.isVerified) {
  // //not verified(activated)
  // // const token = await generateResetTokenTemp();
  // // user.verificationCode = token;
  // // await user.save();
  // // await setupMailSender(
  // //   email,
  // //   'login alert',
  // //   'it seems that your account still not verified or activated please go to that link to activate the account ' +
  // //     `<h3>(www.activate.com)</h3>` +
  // //     `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  // // );
  // const userObj = {
  //   _id: userResponse.user._id,
  //   name: userResponse.user.name,
  //   email: userResponse.user.email,
  // };
  // const IsUserVerified = userUtils.checkUserIsVerified(userResponse.user);
  // if (IsUserVerified) {
  //   return res.status(201).json({
  //     user: userObj,
  //   });
  // } else {
  //   //not verified(not activated)
  //   const token = await generateResetTokenTemp();
  //   userResponse.user.verificationCode = token;
  //   await userResponse.user.save();
  //   await setupMailSender(
  //     userResponse.user.email,
  //     'login alert',
  //     `hi ${
  //       userResponse.user.name.firstName + ' ' + userResponse.user.name.lastName
  //     } it seems that your account still not verified or activated please go to that link to activate the account ` +
  //       `<h3>(www.activate.com)</h3>` +
  //       `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  //   );
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const dataResponsed = await userService.authUser(data, res);
  const userResponsed = {
    ...dataResponsed.user,
  };
  if (dataResponsed.emailAlert) {
    return res.status(201).json({
      user: userResponsed,
      msg: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
    });
  } else {
    return res.status(201).json({
      user: userResponsed,
    });
  }
});
// }
// res.status(201).json({
//   _id: user._id,
//   name: user.name,
//   email: user.email,
// });
// )
// });
//@desc   submit register page
//@route  POST /api/users/
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  // const { name, email, password } = req.body;
  // const userExist = await User.findOne({ email: email });
  // if (userExist) throw new BadRequestError('user is registered already');
  // const user = await User.create(req.body);
  // const newCreatedUser = await userUtils.createUser(req.body);
  // // if (newCreatedUser) {
  // generateToken(res, newCreatedUser.user._id, 'user');
  // await setupMailSender(
  //   newCreatedUser.user.email,
  //   'welcome alert',
  //   `hi ${
  //     newCreatedUser.user.name.firstName +
  //     ' ' +
  //     newCreatedUser.user.name.lastName
  //   } ` +
  //     ' we are happy that you joined our community ... keep spreading goodness with us'
  // );
  const registerInputsData = req.body;
  const dataResponsed = await userService.registerUser(registerInputsData, res);
  const userResponsed = {
    ...dataResponsed.user,
  };
  // const userObj = {
  //   _id: newCreatedUser.user._id,
  //   name: newCreatedUser.user.name,
  //   email: newCreatedUser.user.email,
  // };
  return res.status(201).json({
    user: userResponsed,
  });
  // } else {
  //   throw new BadRequestError('Invalid data');
  // }
});
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = asyncHandler(async (req, res, next) => {
  // const emailIsExist = await User.findOne({ email: req.body.email });
  // if (!emailIsExist) {
  //   throw new Error('email not found Please use another one');
  // }
  // let user = emailIsExist;
  // const userResponse = await userUtils.checkUserIsExist(req.body.email);
  // const token = await generateResetTokenTemp();
  // userResponse.user.verificationCode = token;
  // await userResponse.user.save();
  // await setupMailSender(
  //   userResponse.user.email,
  //   'reset alert',
  //   'go to that link to reset the password (www.dummy.com) ' +
  //     `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  // );
  const resetInputsData = req.body;
  const dataResponsed = await userService.resetUser(resetInputsData);
  return res.status(200).json({
    message: dataResponsed.message,
  });
});
//@desc   reset password
//@route  POST /api/users/confirm
//@access public
const confrimReset = asyncHandler(async (req, res, next) => {
  // const emailIsExist = await User.findOne({ email: req.body.email });
  // if (!emailIsExist) {
  //   throw new Error('email not found Please use another one');
  // }
  // let updatedUser = emailIsExist;
  // let updatedUser = await userUtils.checkUserIsExist(req.body.email);
  // const isEqual = checkValueEquality(
  //   updatedUser.user.verificationCode,
  //   req.body.token
  // );
  // if (!isEqual) {
  //   updatedUser.user.verificationCode = null;
  //   updatedUser.user = await updatedUser.user.save();
  //   throw new UnauthenticatedError(
  //     'invalid token send request again to reset a password'
  //   );
  // }
  // updatedUser.user.password = req.body.password;
  // updatedUser.user.verificationCode = null;
  // updatedUser.user = await updatedUser.user.save();
  // await setupMailSender(
  //   updatedUser.user.email,
  //   'password changed alert',
  //   `hi ${
  //     updatedUser.user.name.firstName + ' ' + updatedUser.user.name.lastName
  //   } <h3>contact us if you did not changed the password</h3>` +
  //     `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  // );
  const resetInputsData = req.body;
  const dataResponsed = await userService.confrimReset(resetInputsData);
  return res.status(200).json({
    message: dataResponsed.message,
  });
});

//@desc   change password
//@route  POST /api/users/changepassword
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  // const userIsExist = await User.findById(req.user._id);
  // if (!userIsExist) {
  //   throw new Error('you are not authorized to change the password');
  // }
  // let updatedUser = req.user;
  // updatedUser.password = req.body.password;
  // updatedUser = await updatedUser.save();
  // await setupMailSender(
  //   updatedUser.email,
  //   'password changed alert',
  //   `hi ${
  //     updatedUser.name.firstName + ' ' + updatedUser.name.lastName
  //   }<h3>contact us if you did not changed the password</h3>` +
  //     `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  // );
  const changePasswordInputsData = req.body;
  const user = req.user;
  const dataResponsed = await userService.changePassword(
    changePasswordInputsData,
    user
  );
  return res.status(200).json({
    message: dataResponsed.message,
  });
});

//@desc   activate account email
//@route  POST /api/users/activate
//@access private
const activateAccount = asyncHandler(async (req, res, next) => {
  // const userIsExist = await User.findById(req.user._id);
  // if (!userIsExist) {
  //   throw new Error('you are not authorized to activate the account');
  // }
  // let storedUser = req.user;

  // if (storedUser.emailVerification.isVerified) {
  //   return res.status(200).json({ message: 'account already is activated' });
  // }
  // const isMatch = checkValueEquality(
  //   storedUser.verificationCode,
  //   req.body.token
  // );
  // if (!isMatch) {
  //   // storedUser.verificationCode = null;
  //   // storedUser = await storedUser.save();
  //   await userUtils.resetSentToken();
  //   userUtils.logout(res);
  //   throw new UnauthenticatedError('invalid token you have been logged out');
  // }
  // // if (updatedUser.verificationCode !== req.body.token) {
  // // updatedUser.verificationCode = null;
  // // updatedUser = await updatedUser.save();
  // // logoutUser(req, res, next);
  // // res.cookie('jwt', '', {
  // //   httpOnly: true,
  // //   expires: new Date(0),
  // // });
  // // userUtils.logout(res)
  // // await setupMailSender(
  // //   req,
  // //   'account still not activated',
  // //   '<h3>contact us if there is another issue about </h3>' );
  // // throw new UnauthenticatedError('invalid token you have been logged out');
  // // }

  // // storedUser.verificationCode = null;
  // // storedUser.emailVerification.isVerified = true;
  // // storedUser.emailVerification.verificationDate = Date.now();
  // // storedUser = await storedUser.save();
  // await userUtils.verifyUserAccount(storedUser);
  // await setupMailSender(
  //   storedUser.email,
  //   'account has been activated ',
  //   `<h2>now you are ready to spread the goodness with us </h2>`
  // );
  const activateAccountInputsData = req.body;
  const user = req.user;
  const dataResponsed = await userService.activateAccount(
    activateAccountInputsData,
    user,
    res
  );
  return res.status(200).json({
    message: dataResponsed.message,
  });
});
//@desc   logout user
//@route  POST /api/users/logout
//@access private
const logoutUser = (req, res, next) => {
  // res.cookie('jwt', '', {
  //   httpOnly: true,
  //   expires: new Date(0),
  // });
  // userUtils.logout(res);
  const dataResponsed = userService.logoutUser(res);
  return res.status(200).json({
    message: dataResponsed.message,
  });
  // res.status(200).json({ message: 'logout' });
};
//@desc   edit user profile
//@route  POST /api/users/profile/edit
//@access private
const editUserProfile = asyncHandler(async (req, res, next) => {
  // const updateUserArgs = dot.dot(req.body);
  const { email } = { ...req.body };
  if (email) {
    //if the edit for email
    // const alreadyRegisteredEmail = await User.findOne({ email });
    await userUtils.checkIsEmailDuplicated(email);
    // if (alreadyRegisteredEmail) {
    //   throw new BadRequestError('Email is already taken!');
    // } else {
    // req.user.email = email;
    // req.user.emailVerification.isVerified = false;
    // req.user.emailVerification.verificationDate = null;
    // const token = await generateResetTokenTemp();
    // req.user.verificationCode = token;
    // await req.user.save();
    // await setupMailSender(
    //   req.user.email,
    //   'email changed alert',
    //   `hi ${
    //     req.user.name.firstName + ' ' + req.user.name.lastName
    //   }email has been changed You must Re activate account ` +
    //     `<h3>(www.activate.com)</h3>` +
    //     `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    // );
    const userWithEmailUpdated = await userUtils.changeUserEmailWithMailAlert(
      req.user,
      email
    ); //email is the NewEmail
    const userObj = {
      _id: userWithEmailUpdated.user._id,
      name: userWithEmailUpdated.user.name,
      email: userWithEmailUpdated.user.email,
    };
    return res.status(201).json({
      ...userObj,
      message:
        'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
    });
    // }
  }
  // console.log(updateUserArgs);
  // Object.assign(req.user, req.body);
  updateNestedProperties(req.user, req.body);
  await req.user.save();

  // const user = await User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //     $set: {
  //       ...updateUserArgs,
  //     },
  //   },
  //   { new: true }
  // );
  // if (!user) throw new NotFoundError('User not found');
  // if (email) {
  //   user.emailVerification.isVerified = false;
  //   user.emailVerification.verificationDate = null;
  //   await user.save();
  // }
  const userObj = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(201).json({
    ...userObj,
    message: 'User Data Changed Successfully',
  });
});
//@desc   get user profile
//@route  GET /api/users/profile
//@access private
const getUserProfileData = (req, res, next) => {
  // const user = await User.findById(req.user._id).select(
  //   '-password -verificationCode'
  // );
  // if (!user) throw new NotFoundError('User not found');
  // try {
  //   // const user = userUtils.getUser(req);
  //   // return res.status(201).json(user);

  // } catch (err) {
  //   next(err);
  // }
  const storedUser = req.user;
  const dataResponsed = userService.getUserProfileData(storedUser);
  return res.status(200).json({
    message: dataResponsed.user,
  });
};

export {
  registerUser,
  authUser,
  logoutUser,
  resetUser,
  confrimReset,
  changePassword,
  activateAccount,
  editUserProfile,
  getUserProfileData,
};
