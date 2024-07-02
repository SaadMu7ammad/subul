import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import { addUsedItemValidation } from './addUsedItemValidation';

export const editUsedItemValidation = (req: Request): ValidationChain[] => [
  ...addUsedItemValidation(req).map(validation => validation.optional()),
];
