import {
  cityValidation,
  descriptionValidation,
  genderValidtion,
  governorateValidation,
  helpedNumbersValidation,
  mainTypeValidation,
  nestedSubTypeValidation,
  privateNumberValidation,
  subTypeValidation,
  targetDonationAmountValidation,
  titleValidation,
} from './allCaseValidation';

const postCaseValidation = [
  titleValidation,
  descriptionValidation,
  mainTypeValidation,
  subTypeValidation,
  nestedSubTypeValidation,
  governorateValidation,
  cityValidation,
  genderValidtion,
  helpedNumbersValidation,
  targetDonationAmountValidation,
  privateNumberValidation,
];

export { postCaseValidation };
