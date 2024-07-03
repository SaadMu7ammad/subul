import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import { registerUserValidation } from './userAuthValidation';

// const editUserProfileValidation = registerUserValidation.map(validator => validator.optional());
const editUserProfileValidation = (req: Request): ValidationChain[] => {
  return registerUserValidation(req).map(validator => validator.optional());
};

export { editUserProfileValidation };
