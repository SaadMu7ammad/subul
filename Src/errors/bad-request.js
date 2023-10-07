import StatusCodes from 'http-status-codes';
// const CustomAPIError = require('./custom-api');
import { CustomAPIError } from './custom-api.js';

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    console.log('BadRequestError');
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export { BadRequestError };
