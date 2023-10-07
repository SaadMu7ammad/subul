import { body, validationResult } from 'express-validator';
const requestResetEmailValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email to reset its password'),
];

export default requestResetEmailValidation;
