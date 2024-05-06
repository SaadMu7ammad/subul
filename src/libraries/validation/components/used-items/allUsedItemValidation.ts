import { body } from "express-validator";

const titleValidation = body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 5, max: 255 })
    .withMessage("Title must be between 5 and 255 characters");

const categoryValidation = body("category")
    .isString()
    .withMessage("Category must be a string")
    .isIn(["clothes", "electronics", "appliances", "furniture", "others"])
    .withMessage("Category must be one of clothes, electronics, appliances, furniture, or others");

const descriptionValidation = body("description")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5, max: 255 })
    .withMessage("Description must be between 5 and 255 characters");

const amountValidation = body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive integer");

export const usedItemValidation = {
    titleValidation,
    categoryValidation,
    descriptionValidation,
    amountValidation,
};