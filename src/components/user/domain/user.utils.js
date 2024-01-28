import {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
} from '../../../errors/index.js';
import { userRepository } from '../data-access/user.repository.js';
import {
    generateResetTokenTemp,
    setupMailSender,
} from '../../../utils/mailer.js';

const checkUserPassword = async (email, password) => {
    const user = await userRepository.findUser(email); //User.findOne({ email: email });
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
    return false;
};
const createUser = async (dataInputs) => {
    const userExist = await userRepository.findUser(dataInputs.email); // User.findOne({ email: dataInputs.email });
    if (userExist) throw new BadRequestError('user is registered already');
    const user = await userRepository.createUser(dataInputs); // User.create(dataInputs);
    if (!user)
        throw new BadRequestError('Error created while creaing the user');
    return { user: user };
};
const checkUserIsExist = async (email) => {
    //return user if it exists
    const userIsExist = await userRepository.findUser(email);
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
    return { user: req.user };
};
const checkIsEmailDuplicated = async (email) => {
    const isDuplicatedEmail = await userRepository.findUser(email);
    if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const changeUserEmailWithMailAlert = async (UserBeforeUpdate, newEmail) => {
    //for sending email if changed or edited
    UserBeforeUpdate.email = newEmail;
    UserBeforeUpdate.emailVerification.isVerified = false;
    UserBeforeUpdate.emailVerification.verificationDate = null;
    const token = await generateResetTokenTemp();
    UserBeforeUpdate.verificationCode = token;
    await setupMailSender(
        UserBeforeUpdate.email,
        'email changed alert',
        `hi ${
            UserBeforeUpdate.name.firstName +
            ' ' +
            UserBeforeUpdate.name.lastName
        }email has been changed You must Re activate account ` +
            `<h3>(www.activate.com)</h3>` +
            `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    await UserBeforeUpdate.save();
    return { user: UserBeforeUpdate };
};
const verifyUserAccount = async (user) => {
    user.verificationCode = null;
    user.emailVerification.isVerified = true;
    user.emailVerification.verificationDate = Date.now();
    user = await user.save();
};
const resetSentToken = async (user) => {
    user.verificationCode = null;
    user = await user.save();
};
export const userUtils = {
    checkUserPassword,
    checkUserIsVerified,
    createUser,
    checkUserIsExist,
    logout,
    getUser,
    checkIsEmailDuplicated,
    verifyUserAccount,
    resetSentToken,
    changeUserEmailWithMailAlert,
};