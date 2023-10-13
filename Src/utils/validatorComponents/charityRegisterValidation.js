import { body } from 'express-validator';
import {
    bankAccountValidation,
    currencyValidation,
    descriptionValidation,
    emailValidation,
    fawryValidation,
    governorateValidation,
    nameValidation,
    passwordValidation,
    vodafoneCashValidation,
} from './validatorComponents.js';

const charityRegisterValidation = [
    emailValidation,
    passwordValidation,
    nameValidation,
    descriptionValidation,
    body('contactInfo.email')
        .trim()
        .notEmpty()
        .withMessage('Email Required')
        .isEmail()
        .withMessage('Invalid email'),
    body('contactInfo.phone')
        .trim()
        .notEmpty()
        .isMobilePhone()
        .withMessage('Invalid PhoneNumber')
        .isLength({ min: 11, max: 11 })
        .withMessage('Invalid PhoneNumber'),
    body('contactInfo.websiteUrl')
        .trim()
        .notEmpty()
        .isURL()
        .withMessage('Invalid URL'),
    currencyValidation,
    governorateValidation,
    body('charityInfo.registeredNumber')
        .trim()
        .notEmpty()
        .withMessage('Registered Number Required')
        .isNumeric(),
    body('charityInfo.establishedDate')
        .trim()
        .notEmpty()
        .withMessage('Established Date Required')
        .isDate(),
    ...bankAccountValidation,
    vodafoneCashValidation,
    fawryValidation
];
export { charityRegisterValidation };