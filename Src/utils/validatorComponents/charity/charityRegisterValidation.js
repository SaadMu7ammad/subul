import { body } from 'express-validator';
import {
  bankAccountValidation,
  currencyValidation,
  descriptionValidation,
  emailValidation,
  fawryValidation,
  governorateValidation,
  nameValidation,
  passwordValidation,
  vodafoneCashValidation,
  contactValidation,
  charityInfoValidation,
  phoneValidation,
} from './allCharityValidation.js';

const charityRegisterValidation = [
  emailValidation,
  passwordValidation,
  nameValidation,
  descriptionValidation,
  ...contactValidation,
  currencyValidation,
  governorateValidation,
  ...charityInfoValidation,
  // ...bankAccountValidation,
  // vodafoneCashValidation,
  // fawryValidation,
  phoneValidation,
];
export { charityRegisterValidation };
