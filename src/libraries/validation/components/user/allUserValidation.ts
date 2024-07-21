import { Request } from 'express';
import { ValidationChain, body } from 'express-validator';

const tokenUserValidation = (req: Request) =>
  body('token').trim().notEmpty().withMessage(req.t('errors.invalidToken'));

const firstNameValidation = (req: Request): ValidationChain =>
  body('name.firstName').trim().notEmpty().withMessage(req.t('errors.firstNameRequired'));

const lastNameValidation = (req: Request): ValidationChain =>
  body('name.lastName').trim().notEmpty().withMessage(req.t('errors.lastNameRequired'));

const nameUserValidation = (req: Request): ValidationChain[] => [
  firstNameValidation(req),
  lastNameValidation(req),
];

const emailValidation = (req: Request): ValidationChain =>
  body('email')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.emailRequired'))
    .isEmail()
    .withMessage(req.t('errors.emailInvalid'));

const passwordValidation = (req: Request) =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.passwordRequired'))
    .isLength({ min: 6, max: 20 })
    .withMessage(req.t('errors.passwordLength'));

const phoneValidation = (req: Request) =>
  body('phone')
    .trim()
    .notEmpty()
    .isMobilePhone('any')
    .withMessage(req.t('errors.phoneNumberRequired'))
    .isLength({ min: 11, max: 11 })
    .withMessage(req.t('errors.invalidPhoneNumber'));

const genderValidtion = (req: Request) =>
  body('gender').isIn(['male', 'female']).withMessage(req.t('errors.genderInvalid'));

const governorateValidation = (req: Request) =>
  body('userLocation.governorate')
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

const nameValidation = body('name').trim().notEmpty().withMessage('Name Required');

const descriptionValidation = body('description')
  .trim()
  .notEmpty()
  .withMessage('Description Required')
  .isLength({ min: 10 })
  .withMessage('Description must be at least 10 characters long');

const currencyValidation = body('currency')
  .trim()
  .notEmpty()
  .withMessage('Currency Required')
  .isIn([
    'AED',
    'AFN',
    'ALL',
    'AMD',
    'ANG',
    'AOA',
    'ARS',
    'AUD',
    'AWG',
    'AZN',
    'BAM',
    'BBD',
    'BDT',
    'BGN',
    'BHD',
    'BIF',
    'BMD',
    'BND',
    'BOB',
    'BRL',
    'BSD',
    'BTN',
    'BWP',
    'BYN',
    'BYR',
    'BZD',
    'CAD',
    'CDF',
    'CHF',
    'CLF',
    'CLP',
    'CNY',
    'COP',
    'CRC',
    'CUC',
    'CUP',
    'CVE',
    'CZK',
    'DJF',
    'DKK',
    'DOP',
    'DZD',
    'EGP',
    'ERN',
    'ETB',
    'EUR',
    'FJD',
    'FKP',
    'GBP',
    'GEL',
    'GHS',
    'GIP',
    'GMD',
    'GNF',
    'GTQ',
    'GYD',
    'HKD',
    'HNL',
    'HRK',
    'HTG',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'IQD',
    'IRR',
    'ISK',
    'JMD',
    'JOD',
    'JPY',
    'KES',
    'KGS',
    'KHR',
    'KMF',
    'KPW',
    'KRW',
    'KWD',
    'KYD',
    'KZT',
    'LAK',
    'LBP',
    'LKR',
    'LRD',
    'LSL',
    'LYD',
    'MAD',
    'MDL',
    'MGA',
    'MKD',
    'MMK',
    'MNT',
    'MOP',
    'MRO',
    'MUR',
    'MVR',
    'MWK',
    'MXN',
    'MXV',
    'MYR',
    'MZN',
    'NAD',
    'NGN',
    'NIO',
    'NOK',
    'NPR',
    'NZD',
    'OMR',
    'PAB',
    'PEN',
    'PGK',
    'PHP',
    'PKR',
    'PLN',
    'PYG',
    'QAR',
    'RON',
    'RSD',
    'RUB',
    'RWF',
    'SAR',
    'SBD',
    'SCR',
    'SDG',
    'SEK',
    'SGD',
    'SHP',
    'SLL',
    'SOS',
    'SRD',
    'SSP',
    'STD',
    'SVC',
    'SYP',
    'SZL',
    'THB',
    'TJS',
    'TMT',
    'TND',
    'TOP',
    'TRY',
    'TTD',
    'TWD',
    'TZS',
    'UAH',
    'UGX',
    'USD',
    'UYI',
    'UYU',
    'UZS',
    'VEF',
    'VND',
    'VUV',
    'WST',
    'XAF',
    'XCD',
    'XOF',
    'XPF',
    'XXX',
    'YER',
    'ZAR',
    'ZMW',
    'ZWL',
  ])
  .withMessage('Currency Invalid');

const bankAccountNumberValidation = body('paymentMethods.bankAccount[0].accNumber')
  .trim()
  .notEmpty()
  .withMessage('Account Number is Required')
  .isNumeric()
  .isLength({ min: 19, max: 19 });

const ibanValidation = body('paymentMethods.bankAccount[0].iban')
  .trim()
  .notEmpty()
  .withMessage('iban is Required')
  .isLength({ min: 29, max: 29 });

const switfCodeValidation = body('paymentMethods.bankAccount[0].swiftCode')
  .trim()
  .notEmpty()
  .withMessage('Swift Code is Required')
  .isLength({ min: 8, max: 11 });

const bankAccountValidation = [bankAccountNumberValidation, ibanValidation, switfCodeValidation];

const vodafoneCashValidation = body('paymentMethods.vodafoneCash[0].number')
  .trim()
  .notEmpty()
  .isMobilePhone('any')
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const fawryValidation = body('paymentMethods.fawry[0].number')
  .trim()
  .notEmpty()
  .isMobilePhone('any')
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

//for changing password
const changePasswordUserValidation = (req: Request) => passwordValidation(req);
//for confirming reset password for user
const confirmResetUserValidation = (req: Request): ValidationChain[] => [
  emailValidation(req),
  passwordValidation(req),
  tokenUserValidation(req),
];
//for requesting reset email for User
const requestResetEmailUserValidation = (req: Request): ValidationChain => emailValidation(req);

export {
  nameUserValidation,
  tokenUserValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  governorateValidation,
  nameValidation,
  descriptionValidation,
  currencyValidation,
  bankAccountValidation,
  vodafoneCashValidation,
  fawryValidation,
  changePasswordUserValidation,
  confirmResetUserValidation,
  requestResetEmailUserValidation,
  genderValidtion,
};
