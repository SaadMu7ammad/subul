import {
  bankAccountValidation,
  charityInfoValidation,
  contactValidation,
  fawryValidation,
  vodafoneCashValidation,
} from './allCharityValidation.js';
import { registerCharityValidation } from './charityAuthValidation.js';

// const _contactValidation = contactValidation.map((validator) =>
//   validator.optional()
// );
// const _charityInfoValidation = charityInfoValidation.map((validator) =>
//   validator.optional()
// );
// const _bankAccountValidation = bankAccountValidation.map((validator) =>
//   validator.optional()
// );
// const editCharityProfileValidation = [
//   emailValidation.optional(),
//   nameValidation.optional(),
//   phoneValidation.optional(),
//   governorateValidation.optional(),
//   currencyValidation.optional(),
//   passwordValidation.optional(),
//   descriptionValidation.optional(),
//   ..._contactValidation,
//   ..._charityInfoValidation,
//   ..._bankAccountValidation,
//   vodafoneCashValidation.optional(),
//   fawryValidation.optional(),
// ];

const editCharityProfileValidation = [
  ...registerCharityValidation,
  // ...bankAccountValidation,
  // ...charityInfoValidation,
  // ...contactValidation,
];
const reqEditPaymentMethodsValidation=[...bankAccountValidation,vodafoneCashValidation,fawryValidation]
// console.log(...editCharityProfileValidation);
editCharityProfileValidation.map((validator) => {
  // console.log('---');
  // console.log(validator);
  validator.optional();
});
reqEditPaymentMethodsValidation.map((validator) => {
  // console.log('---');
  // console.log(validator);
  validator.optional();
});
export { editCharityProfileValidation ,reqEditPaymentMethodsValidation};
