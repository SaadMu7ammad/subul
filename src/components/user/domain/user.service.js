import { userUtils } from './user.utils.js';
import generateToken from '../../../utils/generateToken.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';
import {
  BadRequestError,
  UnauthenticatedError,
} from '../../../errors/components/index.js';
import {
  checkValueEquality,
  updateNestedProperties,
} from '../../../utils/shared.js';
const authUser = async (reqBody, res) => {
  const { email, password } = reqBody;
  const userResponse = await userUtils.checkUserPassword(email, password);
  generateToken(res, userResponse.user._id, 'user');
  const userObj = {
    _id: userResponse.user._id,
    name: userResponse.user.name,
    email: userResponse.user.email,
  };
  const IsUserVerified = userUtils.checkUserIsVerified(userResponse.user);
  if (IsUserVerified) {
    return {
      user: userObj,
      emailAlert: false,
    };
  } else {
    //not verified(not activated)
    const token = await generateResetTokenTemp();
    userResponse.user.verificationCode = token;
    await userResponse.user.save();
    await setupMailSender(
      userResponse.user.email,
      'login alert',
      `hi ${
        userResponse.user.name.firstName + ' ' + userResponse.user.name.lastName
      } it seems that your account still not verified or activated please go to that link to activate the account ` +
        `<h3>(www.activate.com)</h3>` +
        `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    return {
      user: userObj,
      emailAlert: true,
    };
  }
};
const registerUser = async (reqBody, res) => {
  const newCreatedUser = await userUtils.createUser(reqBody);
  generateToken(res, newCreatedUser.user._id, 'user');
  await setupMailSender(
    newCreatedUser.user.email,
    'welcome alert',
    `hi ${
      newCreatedUser.user.name.firstName +
      ' ' +
      newCreatedUser.user.name.lastName
    } ` +
      ' we are happy that you joined our community ... keep spreading goodness with us'
  );
  const userObj = {
    _id: newCreatedUser.user._id,
    name: newCreatedUser.user.name,
    email: newCreatedUser.user.email,
  };
  return {
    user: userObj,
  };
};
const resetUser = async (reqBody) => {
  const userResponse = await userUtils.checkUserIsExist(reqBody.email);
  const token = await generateResetTokenTemp();
  userResponse.user.verificationCode = token;
  await userResponse.user.save();
  await setupMailSender(
    userResponse.user.email,
    'reset alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  return {
    message: 'email sent successfully to reset the password',
  };
};
const confirmReset = async (reqBody) => {
  let updatedUser = await userUtils.checkUserIsExist(reqBody.email);
  const isEqual = checkValueEquality(
    updatedUser.user.verificationCode,
    reqBody.token
  );
  if (!isEqual) {
    updatedUser.user.verificationCode = null;
    updatedUser.user = await updatedUser.user.save();
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  updatedUser.user.password = reqBody.password;
  updatedUser.user.verificationCode = null;
  updatedUser.user = await updatedUser.user.save();
  await setupMailSender(
    updatedUser.user.email,
    'password changed alert',
    `hi ${
      updatedUser.user.name.firstName + ' ' + updatedUser.user.name.lastName
    } <h3>contact us if you did not changed the password</h3>` +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );

  return { message: 'user password changed successfully' };
};
const changePassword = async (reqBody, user) => {
  let updatedUser = user;
  updatedUser.password = reqBody.password;
  updatedUser = await updatedUser.save();
  await setupMailSender(
    updatedUser.email,
    'password changed alert',
    `hi ${
      updatedUser.name.firstName + ' ' + updatedUser.name.lastName
    }<h3>contact us if you did not changed the password</h3>` +
      `<h3>go to link(www.dummy.com) to freeze your account</h3>`
  );
  return { message: 'user password changed successfully' };
};
const activateAccount = async (reqBody, user, res) => {
  let storedUser = user;
  if (storedUser.emailVerification.isVerified) {
    return { message: 'account already is activated' };
  }
  const isMatch = checkValueEquality(
    storedUser.verificationCode,
    reqBody.token
  );
  if (!isMatch) {
    await userUtils.resetSentToken();
    userUtils.logout(res);
    throw new UnauthenticatedError('invalid token you have been logged out');
  }
  await userUtils.verifyUserAccount(storedUser);
  await setupMailSender(
    storedUser.email,
    'account has been activated ',
    `<h2>now you are ready to spread the goodness with us </h2>`
  );

  return {
    message: 'account has been activated successfully',
  };
};
const logoutUser = (res) => {
  userUtils.logout(res);
  return { message: 'logout' };
};
const getUserProfileData = (user) => {
  return { user: user };
};
const editUserProfile = async (reqBody, user) => {
  // const updateUserArgs = dot.dot(req.body);
  if (!reqBody) throw new BadRequestError('no data sent');
  if (
    //put restrection on the edit elements
    !reqBody.name &&
    !reqBody.email &&
    !reqBody.location &&
    !reqBody.gender &&
    !reqBody.phone
  )
    throw new BadRequestError('cant edit that');

  const { email } = { ...reqBody };
  if (email) {
    //if the edit for email
    // const alreadyRegisteredEmail = await User.findOne({ email });
    await userUtils.checkIsEmailDuplicated(email);
    const userWithEmailUpdated = await userUtils.changeUserEmailWithMailAlert(
      user,
      email
    ); //email is the NewEmail
    const userObj = {
      name: userWithEmailUpdated.user.name,
      email: userWithEmailUpdated.user.email,
      location: userWithEmailUpdated.user.location.governorate,
      gender: userWithEmailUpdated.user.gender,
      phone: userWithEmailUpdated.user.phone,
    };
    return {
      emailEdited: true,
      user: userObj,
    };
  }
  updateNestedProperties(user, reqBody);
  await user.save();
  const userObj = {
    name: user.name,
    email: user.email,
    location: user.location.governorate,
    gender: user.gender,
    phone: user.phone,
  };
  return {
    emailEdited: false,
    user: userObj,
  };
};
export const userService = {
  authUser,
  registerUser,
  resetUser,
  confirmReset,
  changePassword,
  activateAccount,
  logoutUser,
  getUserProfileData,
  editUserProfile,
};
