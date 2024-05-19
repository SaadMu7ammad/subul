import {
  charityInfoValidation,
  contactValidation,
  currencyValidation,
  descriptionValidation,
  emailValidation,
  governorateValidation,
  nameValidation,
  passwordValidation,
  phoneValidation,
} from './allCharityValidation';

const registerCharityValidation = [
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
const loginCharityValidation = [emailValidation, passwordValidation];

export { registerCharityValidation, loginCharityValidation };
