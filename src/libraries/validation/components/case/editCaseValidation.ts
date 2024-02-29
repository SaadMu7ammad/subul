import { param } from 'express-validator';
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
