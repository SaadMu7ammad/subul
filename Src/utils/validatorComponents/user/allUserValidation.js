import { body } from 'express-validator';

const tokenUserValidation = body('token')
  .trim()
  .notEmpty()
  .isLength({ min: 64, max: 64 })
  .withMessage('Invalid Token!');
const firstName=  body('name.firstName').trim().notEmpty().withMessage('firstName is required')
const lastName=body('name.lastName').trim().notEmpty().withMessage('lastName is required')
const nameUserValidation=[firstName,lastName]
const emailValidation = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

const passwordValidation = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password Required')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be at least 6 characters long');

const phoneValidation = body('phone')
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const genderValidtion= body('gender')
.isIn(['male', 'female'])
  .withMessage('Gender must be "male" or "female"')

const governorateValidation = body('location.governorate')
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
  .withMessage('governorate Invalid');

const nameValidation = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name Required');

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

const bankAccountNumberValidation = body(
  'paymentMethods.bankAccount[0].accNumber'
)
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

const bankAccountValidation = [
  bankAccountNumberValidation,
  ibanValidation,
  switfCodeValidation,
];

const vodafoneCashValidation = body('paymentMethods.vodafoneCash[0].number')
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const fawryValidation = body('paymentMethods.fawry[0].number')
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

//for changing password
const changePasswordUserValidation = [passwordValidation];
//for confirming reset password for user
const confirmResetUserValidation = [
  emailValidation,
  passwordValidation,
  tokenUserValidation,
];
//for requesting reset email for User
const requestResetEmailUserValidation = [emailValidation];

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
  genderValidtion
};