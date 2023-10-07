import { body, validationResult } from 'express-validator';
const confirmResetValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password Required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('token')
    .trim()
    .notEmpty()
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid Token'),
];
export default confirmResetValidation;
