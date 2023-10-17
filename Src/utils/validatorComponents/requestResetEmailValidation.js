import { body, validationResult } from 'express-validator';
import {emailValidation} from './validatorComponents.js'

const requestResetEmailValidation = [
  emailValidation
];

export default requestResetEmailValidation;
