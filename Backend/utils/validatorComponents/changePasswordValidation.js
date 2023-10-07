import { body, validationResult } from 'express-validator';
const changePasswordValidation = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password Required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long'),
  
];
export default changePasswordValidation;
