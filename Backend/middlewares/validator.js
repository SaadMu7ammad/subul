import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

// User login middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').trim().isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({ min: 6,max:20 })
    .withMessage('Password must be at least 6 characters long'),
];
const loginValidation = [
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 6,max:20 })
      .withMessage('Password must be at least 6 characters long'),
  ];
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    /*"errors": [{
            "type": "field",
            "value": "xyz",
            "msg": "Invalid email",
            "path": "email",
            "location": "body"
        },{},{}
        */
  }
  next();
};
export { registerValidation, validate ,loginValidation};
