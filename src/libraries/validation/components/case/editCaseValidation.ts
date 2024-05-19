import {
  cityValidation,
  descriptionValidation,
  genderValidtion,
  governorateValidation,
  helpedNumbersValidation,
  mainTypeValidation,
  nestedSubTypeValidation,
  subTypeValidation,
  targetDonationAmountValidation,
  titleValidation,
} from './allCaseValidation';

const editCaseValidation = [
  titleValidation.optional(),
  descriptionValidation.optional(),
  mainTypeValidation.optional(),
  subTypeValidation.optional(),
  nestedSubTypeValidation,
  governorateValidation.optional(),
  cityValidation,
  genderValidtion.optional(),
  helpedNumbersValidation.optional(),
  targetDonationAmountValidation.optional(),
];

export { editCaseValidation };
