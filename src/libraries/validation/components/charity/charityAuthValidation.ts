import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import {
  charityInfoValidation,
  contactValidation,
  currencyValidation,
  descriptionValidation,
  emailValidation,
  governorateValidation,
  nameValidation,
  passwordValidation,
  phoneValidation,
} from './allCharityValidation';

const registerCharityValidation = (req: Request): ValidationChain[] => [
  emailValidation(req),
  passwordValidation(req),
  nameValidation(req),
  descriptionValidation(req),
  ...contactValidation,
  currencyValidation(req),
  governorateValidation(req),
  ...charityInfoValidation(req),
  // ...bankAccountValidation,
  // vodafoneCashValidation,
  // fawryValidation,
  phoneValidation(req),
];
const loginCharityValidation = [emailValidation, passwordValidation];

export { registerCharityValidation, loginCharityValidation };
