import { userService } from './user.service.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public
const authUser = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const dataResponsed = await userService.authUser(data, res);
  const userResponsed = {
    ...dataResponsed.user,
  };
  if (dataResponsed.emailAlert) {
    return {
      user: userResponsed,
      msg: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
    };
  } else {
    return {
      user: userResponsed,
    };
  }
};
//@desc   submit register page
//@route  POST /api/users/
//@access public
const registerUser = async (req, res, next) => {
  const registerInputsData = req.body;
  const dataResponsed = await userService.registerUser(registerInputsData, res);
  const userResponsed = {
    ...dataResponsed.user,
  };
  return { user: userResponsed };
};
//@desc   reset password
//@route  POST /api/users/reset
//@access public
const resetUser = async (req, res, next) => {
  const resetInputsData = req.body;
  const dataResponsed = await userService.resetUser(resetInputsData);
  return {
    message: dataResponsed.message,
  };
};
//@desc   reset password
//@route  POST /api/users/confirm
//@access public
const confirmReset = async (req, res, next) => {
  const resetInputsData = req.body;
  const dataResponsed = await userService.confirmReset(resetInputsData);
  return {
    message: dataResponsed.message,
  };
};

//@desc   change password
//@route  POST /api/users/changepassword
//@access private
const changePassword = async (req, res, next) => {
  const changePasswordInputsData = req.body;
  const user = req.user;
  const dataResponsed = await userService.changePassword(
    changePasswordInputsData,
    user
  );
  return {
    message: dataResponsed.message,
  };
};

//@desc   activate account email
//@route  POST /api/users/activate
//@access private
const activateAccount = async (req, res, next) => {
  const activateAccountInputsData = req.body;
  const user = req.user;
  const dataResponsed = await userService.activateAccount(
    activateAccountInputsData,
    user,
    res
  );
  return {
    message: dataResponsed.message,
  };
};
//@desc   logout user
//@route  POST /api/users/logout
//@access private
const logoutUser = (req, res, next) => {
  const dataResponsed = userService.logoutUser(res);
  return {
    message: dataResponsed.message,
  };
};
//@desc   edit user profile
//@route  POST /api/users/profile/edit
//@access private
const editUserProfile = async (req, res, next) => {
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
    return {
      user: dataResponsed.user,
      message:
        'Email Changed Successfully,But you must Re Activate the account with the token sent to your email', // to access editing your other information again',
    };
  } else {
    return {
      user: dataResponsed.user,
      message: 'User Data Changed Successfully',
    };
  }
};
//@desc   get user profile
//@route  GET /api/users/profile
//@access private
const getUserProfileData = (req, res, next) => {
  const storedUser = req.user;
  const dataResponsed = userService.getUserProfileData(storedUser);
  return {
    message: dataResponsed.user,
  };
};

export {
  registerUser,
  authUser,
  logoutUser,
  resetUser,
  confirmReset,
  changePassword,
  activateAccount,
  editUserProfile,
  getUserProfileData,
};
