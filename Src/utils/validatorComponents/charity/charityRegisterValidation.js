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
  ...bankAccountValidation,
  vodafoneCashValidation,
  fawryValidation,
];
export { charityRegisterValidation };
