import express, { Router } from 'express';

const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    resetUser,
    confrimReset,
    changePassword,
    activateAccount,
    editUserProfile,
    getUserProfileData,
} from '../Controllers/userController.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import { auth } from '../middlewares/authMiddleware.js';
import registerValidation from '../utils/validatorComponents/user/userRegisterValidation.js';
import loginValidation from '../utils/validatorComponents/loginValidation.js';
import resetValidationEmailToReset from '../utils/validatorComponents/requestResetEmailValidation.js';
import resetValidationPassToConfirmReset from '../utils/validatorComponents/confirmResetValidation.js';
import changePasswordValidation from '../utils/validatorComponents/changePasswordValidation.js';
import editUserProfileValidation from '../utils/validatorComponents/user/editUserProfileValidation.js';
import { isActivated } from '../middlewares/authStage2Middleware.js';
router.post('/', registerValidation, validate, registerUser);
router.post('/auth', loginValidation, validate, authUser);
router.post('/logout', logoutUser);
//notice reset and /reset/confirm without isActivated coz the if the user didnt activate his account and want to reset the pass
router.post('/reset', resetValidationEmailToReset, validate, resetUser);
router.post(
    '/reset/confirm',
    resetValidationPassToConfirmReset,
    validate,
    confrimReset
);
router.put(
    '/changepassword',
    changePasswordValidation,
    validate,
    auth,
    isActivated,
    changePassword
);
router.post('/activate', auth, activateAccount);
router.get('/profile', auth, getUserProfileData);
router.put(
    '/profile/edit',
    editUserProfileValidation,
    validate,
    auth,
    isActivated,
    editUserProfile
);
//other route will be added after that must be isActivated checker first...


export default router;
