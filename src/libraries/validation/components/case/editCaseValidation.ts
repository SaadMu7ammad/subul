import { Request } from 'express';

import {
  cityValidation,
  descriptionValidation,
  genderValidtion,
  governorateValidation,
  helpedNumbersValidation,
  mainTypeValidation,
  nestedSubTypeValidation,
  subTypeValidation,
  targetDonationAmountValidation,
  titleValidation,
} from './allCaseValidation';

const editCaseValidation = (req: Request) => [
  titleValidation(req).optional(),
  descriptionValidation(req).optional(),
  mainTypeValidation(req).optional(),
  subTypeValidation(req).optional(),
  nestedSubTypeValidation(req),
  governorateValidation(req).optional(),
  cityValidation(req),
  genderValidtion(req).optional(),
  helpedNumbersValidation(req).optional(),
  targetDonationAmountValidation(req).optional(),
];

export { editCaseValidation };
