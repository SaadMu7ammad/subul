import {
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
