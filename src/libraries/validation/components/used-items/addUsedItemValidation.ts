import { usedItemValidation } from './allUsedItemValidation';

export const addUsedItemValidation = [
  usedItemValidation.titleValidation,
  usedItemValidation.categoryValidation,
  usedItemValidation.descriptionValidation,
  usedItemValidation.amountValidation,
];
