import { body } from 'express-validator';
const emailValidation = body('email')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

const nameValidation = body('name')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Name Required');

const descriptionValidation = body('description')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Description Required')
  .isLength({ min: 10 })
  .withMessage('Description must be at least 10 characters long');

const bankAccountNumberValidation = body(
  'paymentMethods.bankAccount[0].accNumber'
)
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Account Number is Required')
  .isNumeric()
  .isLength({ min: 19, max: 19 });

const ibanValidation = body('paymentMethods.bankAccount[0].iban')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('iban is Required')
  .isLength({ min: 29, max: 29 });

const switfCodeValidation = body('paymentMethods.bankAccount[0].swiftCode')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Swift Code is Required')
  .isLength({ min: 8, max: 11 });

const bankAccountValidation = [
  bankAccountNumberValidation,
  ibanValidation,
  switfCodeValidation,
];

const charityInfoRegNumber = body('charityInfo.registeredNumber')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Registered Number Required')
  .isNumeric();

const charityInfoEstDate = body('charityInfo.establishedDate')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Established Date Required')
  .isDate();

const charityInfoValidation = [charityInfoRegNumber, charityInfoEstDate];
const contactInfoEmail = body('contactInfo.email')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

const contactInfoPhone = body('contactInfo.phone')
  .optional()
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const contactInfoWebsiteUrl = body('contactInfo.websiteUrl')
  .optional()
  .trim()
  .notEmpty()
  .isURL()
  .withMessage('Invalid URL');
const contactValidation = [
  contactInfoEmail,
  contactInfoPhone,
  contactInfoWebsiteUrl,
];

const currencyValidation = body('currency')
  .optional()
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

const vodafoneCashValidation = body('paymentMethods.vodafoneCash[0].number')
  .optional()
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const fawryValidation = body('paymentMethods.fawry[0].number')
  .optional()
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const governorateValidation = body('location.governorate')
  .optional()
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
const passwordValidation = body('password')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Password Required')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be at least 6 characters long');

const charityUpdateProfileValidation = [
  emailValidation,
  passwordValidation,
  nameValidation,
  descriptionValidation,
  ...contactValidation,
  ...charityInfoValidation,
  ...bankAccountValidation,
  vodafoneCashValidation,
  fawryValidation,
];
export default charityUpdateProfileValidation;
