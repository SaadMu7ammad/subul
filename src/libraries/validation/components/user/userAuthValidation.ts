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
  emailValidation(req),
  phoneValidation(req),
  genderValidtion(req),
  governorateValidation(req),
  passwordValidation(req),
];

// const registerUserValidation = [
//   ...nameUserValidation,
//   emailValidation,
//   phoneValidation,
//   genderValidtion,
//   governorateValidation,
//   passwordValidation,
// ];
const loginUserValidation = (req: Request): ValidationChain[] => [
  emailValidation(req),
  passwordValidation(req),
];
export { registerUserValidation, loginUserValidation };
