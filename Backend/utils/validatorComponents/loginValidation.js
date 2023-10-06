import { body, validationResult } from 'express-validator';
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
   // .withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .trim()
    .notEmpty()
   // .withMessage('Password Requierd')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long'),
];

export default loginValidation;
