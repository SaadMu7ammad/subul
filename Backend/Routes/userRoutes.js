import express, { Router } from 'express';
import { body, check, validationResult } from 'express-validator';

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  resetUser,
  confrimReset,
} from '../Controllers/userController.js';
import {
  loginValidation,
  registerValidation,
  resetValidationEmailToReset,
  resetValidationPassToConfirmReset,
  validate,
} from '../middlewares/validator.js';
import { auth } from '../middlewares/authMiddleware.js';
router.post('/', registerValidation, validate, registerUser);
router.post('/auth', loginValidation, validate, authUser);
router.post('/reset', resetValidationEmailToReset, validate, resetUser);
router.post('/reset/confirm', resetValidationPassToConfirmReset, validate, confrimReset);

export default router;
