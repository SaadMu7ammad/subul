import { Request } from 'express';
import { ValidationChain, body } from 'express-validator';

const titleValidation = (req: Request) =>
  body('title')
    .isString()
    .withMessage(req.t('usedItems.onlyStringTitle'))
    .isLength({ min: 5, max: 255 })
    .withMessage(req.t('usedItems.titleLength'));

const categoryValidation = (req: Request) =>
  body('category')
    .isString()
    .withMessage(req.t('usedItems.onlyStringCategory'))
    .isIn([
      'clothes',
      'electronics',
      'appliances',
      'furniture',
      'others',
      'ملابس',
      'إلكترونيات',
      'أجهزة',
      'أثاث',
      'آخر',
    ])
    .withMessage(req.t('usedItems.categoryType'));

const descriptionValidation = (req: Request) =>
  body('description')
    .isString()
    .withMessage(req.t('usedItems.onlyStringDescription'))
    .isLength({ min: 10 })
    .withMessage(req.t('errors.descriptionLength'));

const amountValidation = (req: Request) =>
  body('amount')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage(req.t('usedItems.onlyPositiveNumberAmount'));

export const usedItemValidation = (req: Request): ValidationChain[] => [
  titleValidation(req),
  categoryValidation(req),
  descriptionValidation(req),
  amountValidation(req),
];
