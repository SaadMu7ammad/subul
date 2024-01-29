import { body, validationResult } from 'express-validator';
import { emailValidation, genderValidtion, governorateValidation, nameUserValidation, passwordValidation, phoneValidation } from './allUserValidation.js';
const registerUserValidation = [
  ...nameUserValidation,
  emailValidation,
  phoneValidation,
 genderValidtion,
 governorateValidation,
  passwordValidation
];
const loginUserValidation = [emailValidation, passwordValidation];
export { registerUserValidation, loginUserValidation };
