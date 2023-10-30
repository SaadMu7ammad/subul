import {
  bankAccountValidation,
  charityInfoValidation,
  contactValidation,
  fawryValidation,
  vodafoneCashValidation,
} from './allCharityValidation.js';
import { charityRegisterValidation } from './charityRegisterValidation.js';

// const _contactValidation = contactValidation.map((validator) =>
//   validator.optional()
// );
// const _charityInfoValidation = charityInfoValidation.map((validator) =>
//   validator.optional()
// );
// const _bankAccountValidation = bankAccountValidation.map((validator) =>
//   validator.optional()
// );
// const editProfileValidation = [
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

const editProfileValidation = [
  ...charityRegisterValidation,
  // ...bankAccountValidation,
  // ...charityInfoValidation,
  // ...contactValidation,
];
const reqEditPaymentMethods=[...bankAccountValidation,vodafoneCashValidation,fawryValidation]
// console.log(...editProfileValidation);
editProfileValidation.map((validator) => {
  // console.log('---');
  // console.log(validator);
  validator.optional();
});
reqEditPaymentMethods.map((validator) => {
  // console.log('---');
  // console.log(validator);
  validator.optional();
});
export { editProfileValidation ,reqEditPaymentMethods};
