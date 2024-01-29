import { body } from 'express-validator';

const titleValidation = body('title')
    .trim()
    .notEmpty()
    .withMessage('Title Is Required!');
const descriptionValidation = body('description')
    .trim()
    .notEmpty()
    .withMessage('Description Is Required!');
const mainTypeValidation = body('mainType')
    .trim()
    .notEmpty()
    .isIn([
        'Sadaqa',
        'Zakah',
        'BloodDonation',
        'kafarat',
        'Adahi',
        'Campains',
        'UsedProperties',
    ])
    .withMessage('Invalid Main Type!');
const subTypeValidation = body('subType')
    .trim()
    .notEmpty()
    .isIn([
        'Aqeeqa',
        'BloodDonation',
        'Campains',
        'Yameen',
        'Fediat Siam',
        'Foqaraa',
        'Masakeen',
        'Gharemat',
        'Soqia Maa',
        'Health',
        'General Support',
        'Adahy',
        'usedBefore',
    ])
    .withMessage('Invalid Sub Type!');
const nestedSubTypeValidation = body('nestedSubType')
    .optional()
    .trim()
    .notEmpty()
    .isIn([
        'Wasla',
        'Hafr Beer',
        'Burns',
        'Operations & AssistiveDevices',
        'Mini Projects',
        'General Support',
    ])
    .withMessage('Invalid Nested Sub Type!');
const governorateValidation = body('location[0][governorate]')
    .isIn([
        'Alexandria',
        'Assiut',
        'Aswan',
        'Beheira',
        'Bani Suef',
        'Cairo',
        'Daqahliya',
        'Damietta',
        'Fayyoum',
        'Gharbiya',
        'Giza',
        'Helwan',
        'Ismailia',
        'Kafr El Sheikh',
        'Luxor',
        'Marsa Matrouh',
        'Minya',
        'Monofiya',
        'New Valley',
        'North Sinai',
        'Port Said',
        'Qalioubiya',
        'Qena',
        'Red Sea',
        'Sharqiya',
        'Sohag',
        'South Sinai',
        'Suez',
        'Tanta',
    ])
    .withMessage('Invalid Governorate!');
const cityValidation = body('location.city')
    .optional()
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Invalid City');
const genderValidtion = body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be "male" or "female"');
const helpedNumbersValidation = body('helpedNumbers')
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage('Helped Numbers should be at least 1 !');
const targetDonationAmountValidation = body('targetDonationAmount')
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage('Target Donation Amount must be Provided!');

    export {
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
    }