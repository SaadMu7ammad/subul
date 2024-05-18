import { addUsedItemValidation } from './addUsedItemValidation';

export const editUsedItemValidation = addUsedItemValidation.map(validation => {
  return validation.optional();
});
