import {
  bankAccountValidation,
  charityInfoValidation,
  contactValidation,
  fawryValidation,
  paymentIdValidation,
  vodafoneCashValidation,
} from './allCharityValidation.js';
import { registerCharityValidation } from './charityAuthValidation.js';

const editCharityProfileValidation = [
  ...registerCharityValidation,
];
const reqEditPaymentMethodsValidation=[...bankAccountValidation,vodafoneCashValidation,fawryValidation,paymentIdValidation];

editCharityProfileValidation.forEach((validator) => {
  validator.optional();
});

reqEditPaymentMethodsValidation.forEach((validator) => {
  validator.optional();
});

export { editCharityProfileValidation ,reqEditPaymentMethodsValidation};
