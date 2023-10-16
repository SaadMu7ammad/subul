import {
  bankAccountValidation,
  charityInfoValidation,
  contactValidation,
  currencyValidation,
  descriptionValidation,
  emailValidation,
  fawryValidation,
  governorateValidation,
  nameValidation,
  passwordValidation,
  phoneValidation,
  vodafoneCashValidation,
} from './allCharityValidation.js';

const _contactValidation = contactValidation.map((validator) =>
  validator.optional()
);
const _charityInfoValidation = charityInfoValidation.map((validator) =>
  validator.optional()
);
const _bankAccountValidation = bankAccountValidation.map((validator) =>
  validator.optional()
);

const editProfileValidation = [
  emailValidation.optional(),
  nameValidation.optional(),
  phoneValidation.optional(),
  governorateValidation.optional(),
  currencyValidation.optional(),
  passwordValidation.optional(),
  descriptionValidation.optional(),
  ..._contactValidation,
  ..._charityInfoValidation,
  ..._bankAccountValidation,
  vodafoneCashValidation.optional(),
  fawryValidation.optional(),
];
export default editProfileValidation;
