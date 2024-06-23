import { Request } from 'express';
import { ValidationChain, body } from 'express-validator';

const emailValidation = (req: Request): ValidationChain =>
  body('email')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.emailRequired'))
    .isEmail()
    .withMessage(req.t('errors.emailInvalid'));

const nameValidation = (req: Request): ValidationChain =>
  body('name').trim().notEmpty().withMessage(req.t('errors.nameRequired'));

const descriptionValidation = (req: Request): ValidationChain =>
  body('description')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.descriptionRequired'))
    .isLength({ min: 10 })
    .withMessage(req.t('errors.descriptionLength'));

const bankAccountNumberValidation = body('accNumber')
  .trim()
  .notEmpty()
  .withMessage('Account Number is Required')
  .isNumeric()
  .isLength({ min: 19, max: 19 });

const ibanValidation = body('iban')
  .trim()
  .notEmpty()
  .withMessage('iban is Required')
  .isLength({ min: 29, max: 29 });
const switfCodeValidation = body('swiftCode')
  .trim()
  .notEmpty()
  .withMessage('Swift Code is Required')
  .isLength({ min: 8, max: 11 });

const bankAccountValidation = [bankAccountNumberValidation, ibanValidation, switfCodeValidation];

const charityInfoRegNumber = (req: Request) =>
  body('charityInfo.registeredNumber')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.regNumber'))
    .isNumeric();

const charityInfoEstDate = (req: Request) =>
  body('charityInfo.establishedDate')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.estDate'))
    .isDate();

const charityInfoValidation = (req: Request) => [
  charityInfoRegNumber(req),
  charityInfoEstDate(req),
];

const contactInfoEmail = body('contactInfo.email')
  .trim()
  .notEmpty()
  .withMessage('Email Required')
  .isEmail()
  .withMessage('Invalid email');

const contactInfoPhone = body('contactInfo.phone')
  .trim()
  .notEmpty()
  .isMobilePhone('any')
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const contactInfoWebsiteUrl = body('contactInfo.websiteUrl')
  .trim()
  .notEmpty()
  .isURL()
  .withMessage('Invalid URL');
const contactValidation = [contactInfoEmail, contactInfoPhone, contactInfoWebsiteUrl];

const currencyValidation = (req: Request): ValidationChain =>
  body('currency')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.currencyRequired'))
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
    .withMessage(req.t('errors.currencyInvalid'));

const vodafoneCashValidation = body('vodafoneNumber')
  .trim()
  .notEmpty()
  .isMobilePhone('any')
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const fawryValidation = body('fawryNumber')
  .trim()
  .notEmpty()
  .isMobilePhone('any')
  .withMessage('Invalid PhoneNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('Invalid PhoneNumber');

const governorateValidation = (req: Request): ValidationChain =>
  body('charityLocation.governorate')
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

const passwordValidation = (req: Request): ValidationChain =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage(req.t('errors.passwordRequired'))
    .isLength({ min: 6, max: 20 })
    .withMessage(req.t('errors.passwordLength'));

const tokenCharityValidation = body('token')
  .trim()
  .notEmpty()
  // .isLength({ min: 64, max: 64 })
  .isLength({ min: 60, max: 60 })
  .withMessage('Invalid Token!');

const phoneValidation = (req: Request) =>
  body('phone')
    .trim()
    .notEmpty()
    .isMobilePhone('any')
    .withMessage(req.t('errors.phoneNumberRequired'))
    .isLength({ min: 11, max: 11 })
    .withMessage(req.t('errors.invalidPhoneNumber'));

// const _bankAccountValidation = bankAccountValidation.map(
//   (validator) => validator.optional() //.not().isEmpty()
// );
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
const confirmResetCharityValidation = [emailValidation, passwordValidation, tokenCharityValidation];
//for requesting reset email for charity
const requestResetEmailCharityValidation = [emailValidation];

const paymentIdValidation = body('payment_id')
  .trim()
  .notEmpty()
  .isMongoId()
  .withMessage('Invalid Id!');

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
  paymentIdValidation,
};
