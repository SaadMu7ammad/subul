import { body, validationResult } from 'express-validator';
import { registerUserValidation } from './userAuthValidation.js';
const editUserProfileValidation = registerUserValidation.map((validator) =>
  validator.optional()
);
export { editUserProfileValidation };
