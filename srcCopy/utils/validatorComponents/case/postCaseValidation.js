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
} from './allCaseValidation.js';
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
];

export { postCaseValidation };
