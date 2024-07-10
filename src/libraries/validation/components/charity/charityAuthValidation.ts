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
  ...contactValidation(req).map(v => v.optional()),
  currencyValidation(req),
  governorateValidation(req),
  ...charityInfoValidation(req),
  phoneValidation(req),
];
const loginCharityValidation = (req: Request): ValidationChain[] => [
  emailValidation(req),
  passwordValidation(req),
];

export { registerCharityValidation, loginCharityValidation };
