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

const reqEditPaymentMethodsValidation = [
  ...bankAccountValidation,
  vodafoneCashValidation,
  fawryValidation,
  paymentIdValidation,
];

// editCharityProfileValidation.forEach(validator => {
//   validator.optional();
// });

reqEditPaymentMethodsValidation.forEach(validator => {
  validator.optional();
});

export { editCharityProfileValidation, reqEditPaymentMethodsValidation };
// export { reqEditPaymentMethodsValidation };
