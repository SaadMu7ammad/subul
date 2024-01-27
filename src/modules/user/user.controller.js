import asyncHandler from 'express-async-handler';
import { userService } from './user.service.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public
const authUser = asyncHandler(async (req, res, next) => {
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
//@desc   submit register page
//@route  POST /api/users/
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const registerInputsData = req.body;
  const dataResponsed = await userService.registerUser(registerInputsData, res);
  const userResponsed = {
    ...dataResponsed.user,
  };
  return res.status(201).json({
    user: userResponsed,
  });
});
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = asyncHandler(async (req, res, next) => {
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
  // const userObj = {//for TS
  //   name: {
  //     firstName: req.body?.name?.firstName,
  //     lastName: req.body?.name?.lastName,
  //   },
  //   email: req.body?.email,
  //   location: req.body?.location?.governorate,
  //   gender: req.body?.gender,
  //   phone: req.body?.phone,
  // };
  // const editUserProfileInputsData = userObj;
  const editUserProfileInputsData = req.body;
  const user = req.user;
  const dataResponsed = await userService.editUserProfile(
    editUserProfileInputsData,
    user
  );
  if (dataResponsed.emailEdited) {
    return res.status(201).json({
      user: dataResponsed.user,
      message:
        'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
    });
  } else {
    return res.status(201).json({
      user: dataResponsed.user,
      message: 'User Data Changed Successfully',
    });
  }
});
//@desc   get user profile
//@route  GET /api/users/profile
//@access private
const getUserProfileData = (req, res, next) => {
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
