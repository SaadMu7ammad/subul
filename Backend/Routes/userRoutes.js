import express, { Router } from 'express';
import { body, check, validationResult } from 'express-validator';

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
} from '../Controllers/userController.js';
import { loginValidation, registerValidation, validate } from '../middlewares/validator.js';
import { auth } from '../middlewares/authMiddleware.js';
router.post('/', registerValidation, validate, registerUser);
router.post(
  '/auth',
  loginValidation, validate,
  authUser
);
router.post('/logout', logoutUser);

export default router;
