import { body } from 'express-validator';
const emailValidation = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

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

const bankAccountNumberValidation = body(
  'paymentMethods.bankAccount[0].accNumber'
)
  .trim()
  .notEmpty()
  // .if(body('paymentMethods.bankAccount[0].iban').exists())
  // .if(body('paymentMethods.bankAccount[0].swiftCode').exists())
  .withMessage('Account Number is Required')
  .isNumeric()
  .isLength({ min: 19, max: 19 });

const ibanValidation = body('paymentMethods.bankAccount[0].iban')
  .trim()
  // .if(body('paymentMethods.bankAccount[0].swiftCode').exists())
  // .if(body('paymentMethods.bankAccount[0].accNumber').exists())
  .notEmpty()
  .withMessage('iban is Required')
  .isLength({ min: 29, max: 29 });
const switfCodeValidation = body('paymentMethods.bankAccount[0].swiftCode')
  .trim()
  // .if(body('paymentMethods.bankAccount[0].iban').exists())
  // .if(body('paymentMethods.bankAccount[0].accNumber').exists())
  .notEmpty()
  .withMessage('Swift Code is Required')
  .isLength({ min: 8, max: 11 });

const bankAccountValidation = [
  bankAccountNumberValidation,
  ibanValidation,
  switfCodeValidation,
];

const charityInfoRegNumber = body('charityInfo.registeredNumber')
  .trim()
  .notEmpty()
  .withMessage('Registered Number Required')
  .isNumeric();

const charityInfoEstDate = body('charityInfo.establishedDate')
  .trim()
  .notEmpty()
  .withMessage('Established Date Required')
  .isDate();

const charityInfoValidation = [charityInfoRegNumber, charityInfoEstDate];
const contactInfoEmail = body('contactInfo.email')
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

const contactInfoPhone = body('contactInfo.phone')
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const contactInfoWebsiteUrl = body('contactInfo.websiteUrl')
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
const passwordValidation = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password Required')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be at least 6 characters long');

const tokenCharityValidation = body('token')
  .trim()
  .notEmpty()
  // .isLength({ min: 64, max: 64 })
  .isLength({ min: 60, max: 60 })
  .withMessage('Invalid Token!');

const phoneValidation = body('phone')
  .trim()
  .notEmpty()
  .isMobilePhone()
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const _bankAccountValidation = bankAccountValidation.map(
  (validator) => validator.optional() //.not().isEmpty()
);
// const paymentValidation = [
//   ..._bankAccountValidation,
//   vodafoneCashValidation.optional(),
//   fawryValidation.optional(),
// ];
// const paymentValidation = validate(function (value) {
// value.iban()
// },'Validation input bank not completed')

//for changing password
const changePasswordCharityValidation = [passwordValidation];

//for confirming reset password for charity
const confirmResetCharityValidation = [
  emailValidation,
  passwordValidation,
  tokenCharityValidation,
];
//for requesting reset email for charity
const requestResetEmailCharityValidation = [emailValidation];
export {
  tokenCharityValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  governorateValidation,
  nameValidation,
  descriptionValidation,
  currencyValidation,
  bankAccountValidation,
  charityInfoValidation,
  vodafoneCashValidation,
  fawryValidation,
  contactValidation,
  // paymentValidation,
  bankAccountNumberValidation,
  ibanValidation,
  switfCodeValidation,
  changePasswordCharityValidation,
  confirmResetCharityValidation,
  requestResetEmailCharityValidation,
};
