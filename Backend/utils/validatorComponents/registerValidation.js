import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required'),
  body('email')
    .trim()
    .isEmpty()
    //.withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .trim()
    .isEmpty()
    //.withMessage('Password Required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long'),
];
export default registerValidation;
