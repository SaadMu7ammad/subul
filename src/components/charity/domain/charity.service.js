import {
  BadRequestError,
  UnauthenticatedError,
} from '../../../libraries/errors/components/index.js';
import {
  checkValueEquality,
  updateNestedProperties,
} from '../../../utils/shared.js';
import { charityUtils } from './charity.utils.js';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../utils/mailer.js';

const requestResetPassword = async (reqBody) => {
  const charityResponse = await charityUtils.checkCharityIsExist(reqBody.email);
  const token = await generateResetTokenTemp();
  await charityUtils.setTokenToCharity(charityResponse.charity, token);
  await setupMailSender(
    charityResponse.charity.email,
    'reset alert',
    'go to that link to reset the password (www.dummy.com) ' +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
  );
  return {
    charity: charityResponse.charity,
    message: 'email sent successfully to reset the password',
  };
};

const confirmResetPassword = async (reqBody) => {
  let updatedCharity = await charityUtils.checkCharityIsExist(reqBody.email);
  const isEqual = checkValueEquality(
    updatedCharity.charity.verificationCode,
    reqBody.token
  );
  if (!isEqual) {
    await charityUtils.resetSentToken(updatedCharity.charity);
    throw new UnauthenticatedError(
      'invalid token send request again to reset a password'
    );
  }
  await charityUtils.changeCharityPasswordWithMailAlert(
    updatedCharity.charity,
    reqBody.password
  );
  return { message: 'charity password changed successfully' };
};
// const changePassword = async (reqBody, user) => {
//     let updatedUser = user;
//     updatedUser.password = reqBody.password;
//     updatedUser = await updatedUser.save();
//     await setupMailSender(
//         updatedUser.email,
//         'password changed alert',
//         `hi ${
//             updatedUser.name.firstName + ' ' + updatedUser.name.lastName
//         }<h3>contact us if you did not changed the password</h3>` +
//             `<h3>go to link(www.dummy.com) to freeze your account</h3>`
//     );
//     return { message: 'user password changed successfully' };
// };
// const activateAccount = async (reqBody, user, res) => {
//     let storedUser = user;
//     if (storedUser.emailVerification.isVerified) {
//         return { message: 'account already is activated' };
//     }
//     const isMatch = checkValueEquality(
//         storedUser.verificationCode,
//         reqBody.token
//     );
//     if (!isMatch) {
//         await userUtils.resetSentToken();
//         userUtils.logout(res);
//         throw new UnauthenticatedError(
//             'invalid token you have been logged out'
//         );
//     }
//     await userUtils.verifyUserAccount(storedUser);
//     await setupMailSender(
//         storedUser.email,
//         'account has been activated ',
//         `<h2>now you are ready to spread the goodness with us </h2>`
//     );

//     return {
//         message: 'account has been activated successfully',
//     };
// };
const logoutCharity = (res) => {
  charityUtils.logout(res);
  return { message: 'logout' };
};
const getCharityProfileData = (charity) => {
  return { charity: charity };
};
// const editUserProfile = async (reqBody, user) => {
//     // const updateUserArgs = dot.dot(req.body);
//     if (!reqBody) throw new BadRequestError('no data sent');
//     if (
//         //put restrection on the edit elements
//         !reqBody.name &&
//         !reqBody.email &&
//         !reqBody.location &&
//         !reqBody.gender &&
//         !reqBody.phone
//     )
//         throw new BadRequestError('cant edit that');

//     const { email } = { ...reqBody };
//     if (email) {
//         //if the edit for email
//         // const alreadyRegisteredEmail = await User.findOne({ email });
//         await userUtils.checkIsEmailDuplicated(email);
//         const userWithEmailUpdated =
//             await userUtils.changeUserEmailWithMailAlert(user, email); //email is the NewEmail
//         const userObj = {
//             name: userWithEmailUpdated.user.name,
//             email: userWithEmailUpdated.user.email,
//             location: userWithEmailUpdated.user.location.governorate,
//             gender: userWithEmailUpdated.user.gender,
//             phone: userWithEmailUpdated.user.phone,
//         };
//         return {
//             emailEdited: true,
//             user: userObj,
//         };
//     }
//     updateNestedProperties(user, reqBody);
//     await user.save();
//     const userObj = {
//         name: user.name,
//         email: user.email,
//         location: user.location.governorate,
//         gender: user.gender,
//         phone: user.phone,
//     };
//     return {
//         emailEdited: false,
//         user: userObj,
//     };
// };
export const charityService = {
  requestResetPassword,
  confirmResetPassword,
  // changePassword,
  // activateAccount,
  logoutCharity,
  getCharityProfileData,
  // editUserProfile,
};
