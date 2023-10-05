import { body, validationResult } from 'express-validator';
const requestResetEmailValidation = [
  body('email')
    .trim()
    .isEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email to reset its password'),
];

export default requestResetEmailValidation;
