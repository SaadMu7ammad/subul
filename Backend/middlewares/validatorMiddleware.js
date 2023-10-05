import asyncHandler from 'express-async-handler';
import {  validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    /*"errors": [{
            "type": "field",
            "value": "xyz",
            "message": "Invalid email",
            "path": "email",
            "location": "body"
        },{},{}
        */
  }
  next();
};
export { validate };
