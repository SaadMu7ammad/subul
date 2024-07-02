import { Request } from 'express';
import { ValidationChain, body } from 'express-validator';

export const deleteUsedItemImageValidation = (req: Request): ValidationChain =>
  body('imageName')
    .isString()
    .notEmpty()
    .matches(/.*\.(jpg|jpeg|png)$/)
    // Image name must end with .jpg, .jpeg, or .png.
    .withMessage(req.t('usedItems.imageNameInvalid'));
