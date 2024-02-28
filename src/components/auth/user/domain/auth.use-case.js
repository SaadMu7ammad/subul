import { authUserService } from './auth.service.js';
//@desc   submit login page
//@route  POST /api/users/auth
//@access public
const authUser = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const responseData = await authUserService.authUser(data, res);
  const userResponsed = {
    ...responseData.user,
  };
  if (responseData.emailAlert) {
    return {
      user: userResponsed,
      msg: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
      token: responseData.token,
    };
  } else {
    return {
      user: userResponsed,
      token: responseData.token,
    };
  }
};
//@desc   submit register page
//@route  POST /api/users/
//@access public
const registerUser = async (req, res, next) => {
  const registerInputsData = req.body;
  const responseData = await authUserService.registerUser(
    registerInputsData,
    res
  );
  const userResponsed = {
    ...responseData.user,
  };
  return { user: userResponsed };
};
export const authUseCase = {
  registerUser,
  authUser,
};
