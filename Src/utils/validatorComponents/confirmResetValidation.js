import { body, validationResult } from 'express-validator';
import {emailValidation,passwordValidation,tokenValidation} from './validatorComponents.js'

const confirmResetValidation = [
  emailValidation,
  passwordValidation,
  tokenValidation
];
export default confirmResetValidation;
