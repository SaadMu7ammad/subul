import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import {
  bankAccountValidation,
  fawryValidation,
  paymentIdValidation,
  vodafoneCashValidation,
} from './allCharityValidation';
import { registerCharityValidation } from './charityAuthValidation';

const editCharityProfileValidation = (req: Request): ValidationChain[] => {
  return registerCharityValidation(req).map(validator => validator.optional());
};

const reqEditPaymentMethodsValidation = (req: Request): ValidationChain[] => [
  ...bankAccountValidation(req).map(v => v.optional()),
  vodafoneCashValidation(req).optional(),
  fawryValidation(req).optional(),
  paymentIdValidation(req).optional(),
];

export { editCharityProfileValidation, reqEditPaymentMethodsValidation };
