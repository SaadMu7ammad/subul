import express, { Router } from 'express';

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  resetUser,
  confrimReset,
} from '../Controllers/userController.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import { auth } from '../middlewares/authMiddleware.js';
import registerValidation from '../utils/validatorComponents/registerValidation.js';
import loginValidation from '../utils/validatorComponents/loginValidation.js';
import resetValidationEmailToReset from '../utils/validatorComponents/requestResetEmailValidation.js';
import resetValidationPassToConfirmReset from '../utils/validatorComponents/confirmResetValidation.js';

router.post('/', registerValidation, validate, registerUser);
router.post('/auth', loginValidation, validate, authUser);
router.post('/logout', logoutUser);
router.post('/reset', resetValidationEmailToReset, validate, resetUser);
router.post(
  '/reset/confirm',
  resetValidationPassToConfirmReset,
  validate,
  confrimReset
);

export default router;
