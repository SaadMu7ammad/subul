import { Request } from 'express';
import { body } from 'express-validator';

const titleValidation = (req: Request) =>
  body('title').trim().notEmpty().withMessage(req.t('errors.titleRequired'));

const descriptionValidation = (req: Request) =>
  body('description').trim().notEmpty().withMessage(req.t('errors.descriptionRequired'));

const mainTypeValidation = (req: Request) =>
  body('mainType')
    .trim()
    .notEmpty()
    .isIn(['Sadaqa', 'Zakah', 'BloodDonation', 'kafarat', 'Adahi', 'Campaigns', 'UsedProperties'])
    .withMessage(req.t('errors.invalidMainType'));

const subTypeValidation = (req: Request) =>
  body('subType')
    .trim()
    .notEmpty()
    .isIn([
      'Aqeeqa',
      'BloodDonation',
      'Campaigns',
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
    .withMessage(req.t('errors.invalidSubType'));

const nestedSubTypeValidation = (req: Request) =>
  body('nestedSubType')
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
    .withMessage(req.t('errors.invalidNestedSubType'));

const governorateValidation = (req: Request) =>
  body('caseLocation[0][governorate]')
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
    .withMessage(req.t('errors.governorateInvalid'));

const cityValidation = (req: Request) =>
  body('location.city')
    .optional()
    .trim()
    .notEmpty()
    .isString()
    .withMessage(req.t('errors.cityInvalid'));

const genderValidtion = (req: Request) =>
  body('gender').isIn(['male', 'female', 'none']).withMessage(req.t('errors.genderInvalid'));

const helpedNumbersValidation = (req: Request) =>
  body('helpedNumbers').trim().notEmpty().isNumeric().withMessage(req.t('errors.helpedNumbers'));

const privateNumberValidation = (req: Request) =>
  body('privateNumber')
    .trim()
    .optional()
    .notEmpty()
    .isMobilePhone('any')
    .withMessage(req.t('errors.invalidPhoneNumber'))
    .isLength({ min: 11, max: 11 })
    .withMessage(req.t('errors.invalidPhoneNumber'));

const targetDonationAmountValidation = (req: Request) =>
  body('targetDonationAmount')
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage(req.t('errors.targetDonationAmount'));

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
  privateNumberValidation,
};
