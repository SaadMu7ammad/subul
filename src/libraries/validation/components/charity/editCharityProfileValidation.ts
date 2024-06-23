import {
  bankAccountValidation,
  fawryValidation,
  paymentIdValidation,
  vodafoneCashValidation,
} from './allCharityValidation';

// import { registerCharityValidation } from './charityAuthValidation';

// const editCharityProfileValidation = [...registerCharityValidation];

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

// export { editCharityProfileValidation, reqEditPaymentMethodsValidation };
export { reqEditPaymentMethodsValidation };
