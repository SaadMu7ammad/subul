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
    privateNumberValidation,
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
    privateNumberValidation
];

export { postCaseValidation };
