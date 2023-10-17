import { body, validationResult } from 'express-validator';
import registerValidation from './userRegisterValidation.js';
export default registerValidation.map((validator) => validator.optional());
