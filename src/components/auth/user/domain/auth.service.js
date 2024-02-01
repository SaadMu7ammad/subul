import { authUserUtils } from './auth.utils.js';
import generateToken from '../../../../utils/generateToken.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../../utils/mailer.js';

const authUser = async (reqBody, res) => {
  const { email, password } = reqBody;
  const userResponse = await authUserUtils.checkUserPassword(email, password);
  generateToken(res, userResponse.user._id, 'user');
  const userObj = {
    _id: userResponse.user._id,
    name: userResponse.user.name,
    email: userResponse.user.email,
  };
  const IsUserVerified = authUserUtils.checkUserIsVerified(userResponse.user);
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
  const newCreatedUser = await authUserUtils.createUser(reqBody);
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

export const authUserService = {
  authUser,
  registerUser,
};