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
} from '../controllers/userController.js';

import { validate } from '../middlewares/validatorMiddleware.js';
import { auth } from '../middlewares/authMiddleware.js';
import { editUserProfileValidation } from '../utils/validatorComponents/user/editUserProfileValidation.js';
import {
  registerUserValidation,
  loginUserValidation,
} from '../utils/validatorComponents/user/userAuthValidation.js';
import {
  changePasswordUserValidation,
  confirmResetUserValidation,
  requestResetEmailUserValidation,
  tokenUserValidation,
} from '../utils/validatorComponents/user/allUserValidation.js';
import { isActivated } from '../middlewares/authStage2Middleware.js';
import {
  getAllTransactions,
} from '../controllers/transaction.controller.js';
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
router.post('/activate', tokenUserValidation, validate, auth, activateAccount);
router.get('/profile', auth, getUserProfileData);
router.put(
  '/profile/edit',
  editUserProfileValidation,
  validate,
  auth,
  isActivated,
  editUserProfile
);
// //other route will be added after that must be isActivated checker first...
// router.post(
//   '/addTransaction/paymob/onlinecard',
//   auth,
//   isActivated,
//   preCreateTransaction,
//   payWithOnlineCard
// );
// router.post(
//   '/addTransaction/paymob/mobilewallet',
//   auth,
//   isActivated,
//   preCreateTransaction,
//   paywithMobileWallet
// );

router.get('/myTransactions', auth, isActivated, getAllTransactions);

// //done first
// // //Transaction processed callback
// router.post('/callback', hmacSetting, updateCaseInfoOrRefund);

// //then
// //Transaction response callback
// router.get('/callback', (req, res, next) => {
//   res.send(req.query);
//   // res.send(req.query['data.message']);
// });
export default router;
