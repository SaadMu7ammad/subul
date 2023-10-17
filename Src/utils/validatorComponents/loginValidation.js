import { body, validationResult } from 'express-validator';
import {emailValidation,passwordValidation} from './validatorComponents.js'
const loginValidation = [
  emailValidation,
  passwordValidation
];

export default loginValidation;
