import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import {
  cityValidation,
  descriptionValidation,
  genderValidtion,
  governorateValidation,
  helpedNumbersValidation,
  mainTypeValidation,
  nestedSubTypeValidation,
  privateNumberValidation,
  subTypeValidation,
  targetDonationAmountValidation,
  titleValidation,
} from './allCaseValidation';

const postCaseValidation = (req: Request): ValidationChain[] => [
  titleValidation(req),
  descriptionValidation(req),
  mainTypeValidation(req),
  subTypeValidation(req),
  nestedSubTypeValidation(req),
  governorateValidation(req),
  cityValidation(req),
  genderValidtion(req),
  helpedNumbersValidation(req),
  targetDonationAmountValidation(req),
  privateNumberValidation(req),
];

export { postCaseValidation };
