import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import {
  emailValidation,
  genderValidtion,
  governorateValidation,
  nameUserValidation,
  passwordValidation,
  phoneValidation,
} from './allUserValidation';

const registerUserValidation = (req: Request): ValidationChain[] => [
  ...nameUserValidation(req),
  emailValidation,
  phoneValidation,
  genderValidtion,
  governorateValidation,
  passwordValidation,
];

// const registerUserValidation = [
//   ...nameUserValidation,
//   emailValidation,
//   phoneValidation,
//   genderValidtion,
//   governorateValidation,
//   passwordValidation,
// ];
const loginUserValidation = [emailValidation, passwordValidation];
export { registerUserValidation, loginUserValidation };
