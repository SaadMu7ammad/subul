import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('name.firstName').trim().notEmpty().withMessage('firstName is required'),
  body('name.lastName').trim().notEmpty().withMessage('lastName is required'),
  body('email')
    .trim()
    .notEmpty()
    //.withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid email'),
  body('phone')
    .notEmpty()
    .isLength({ min: 11, max: 11 })
    .withMessage('Invalid PhoneNumber'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be "male" or "female"'),
  body('location.governorate')
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
    .withMessage('governorate Invalid'),
  body('password')
    .trim()
    .notEmpty()
    //.withMessage('Password Required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long'),
];
export default registerValidation;
