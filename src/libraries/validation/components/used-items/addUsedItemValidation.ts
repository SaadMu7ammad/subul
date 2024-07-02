import { Request } from 'express';
import { ValidationChain } from 'express-validator';

import { usedItemValidation } from './allUsedItemValidation';

export const addUsedItemValidation = (req: Request): ValidationChain[] => [
  ...usedItemValidation(req),
];
