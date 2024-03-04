import {
  currencyValidation,
  descriptionValidation,
  emailValidation,
  governorateValidation,
  nameValidation,
  passwordValidation,
  contactValidation,
  charityInfoValidation,
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
