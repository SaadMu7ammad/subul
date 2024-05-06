import { body } from 'express-validator';

export const deleteUsedItemImageValidation = [
  body('imageName')
    .isString()
    .notEmpty()
    .matches(/.*\.(jpg|jpeg|png)$/)
    .withMessage('Image name must end with .jpg, .jpeg, or .png.'),
];
