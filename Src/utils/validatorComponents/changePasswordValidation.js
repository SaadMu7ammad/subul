import { body, validationResult } from 'express-validator';
import {passwordValidation} from './validatorComponents.js'

const changePasswordValidation = [
  passwordValidation
];
export default changePasswordValidation;
