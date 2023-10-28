import { UnauthenticatedError } from '../errors/unauthenticated.js';
const isConfirmed = (req, res, next) => {
  //for the sending docs to the admin website for Chariy Only
  if (req.charity && req.charity.isConfirmed && req.charity.isEnabled) {
    next();
  } else {
    throw new UnauthenticatedError(
      'Charity Account is not Confirmed , You must upload your docs first!'
    );
  }
};
const isActivated = (req, res, next) => {
  //for both charity and user
  if (
    (req.charity &&
      (req.charity.emailVerification.isVerified ||
        req.charity.phoneVerification.isVerified)) ||
    (req.user &&
      (req.user.emailVerification.isVerified ||
        req.user.phoneVerification.isVerified))
  ) {
    next();
  } else {
    if (req.charity) {
      throw new UnauthenticatedError(
        'Charity Account is not Activated , You must activate your account via email or phone number first!'
      );
    } else if (req.user) {
      throw new UnauthenticatedError(
        'User Account is not Activated , You must activate your account via email or phone number first!'
      );
    }
  }
};
export { isConfirmed, isActivated };
