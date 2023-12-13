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
import {editUserProfileValidation} from '../utils/validatorComponents/user/editUserProfileValidation.js';
import {registerUserValidation,loginUserValidation} from '../utils/validatorComponents/user/userAuthValidation.js'
import {changePasswordUserValidation, confirmResetUserValidation, requestResetEmailUserValidation, tokenUserValidation} from '../utils/validatorComponents/user/allUserValidation.js'
import { isActivated } from '../middlewares/authStage2Middleware.js';
import { createTransaction,getAllTransactions, updateCaseInfo } from '../Controllers/transaction.controller.js';
import { payWithOnlineCard } from '../paymob/onlineCards/onlineCards.controller.js';
import { paywithMobileWallet } from '../paymob/mobileWallets/mobileWallets.controller.js';
router.post('/', registerUserValidation, validate, registerUser);
router.post('/auth', loginUserValidation, validate, authUser);
router.post('/logout', logoutUser);
//notice reset and /reset/confirm without isActivated coz the if the user didnt activate his account and want to reset the pass
router.post('/reset', requestResetEmailUserValidation, validate, resetUser);
router.post(
    '/reset/confirm',
    confirmResetUserValidation,
    validate,
    confrimReset
);
router.put(
    '/changepassword',
    changePasswordUserValidation,
    validate,
    auth,
    isActivated,
    changePassword
);
router.post('/activate',tokenUserValidation,validate, auth, activateAccount);
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
router.post('/addTransaction/paymob/onlinecard',auth,isActivated, createTransaction,payWithOnlineCard);
router.post('/addTransaction/paymob/mobilewallet',auth,isActivated, createTransaction,paywithMobileWallet);

router.get('/myTransactions',auth,isActivated, getAllTransactions);

//done first
// //Transaction processed callback
router.post('/callback', updateCaseInfo);
//then
//Transaction response callback
router.get('/callback', async (req, res, next) => {
  res.send(req.query);
});
export default router;
