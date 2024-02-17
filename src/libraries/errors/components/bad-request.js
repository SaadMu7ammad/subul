import { CustomAPIError } from './custom-api.js';

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    console.log('BadRequestError');
    this.statusCode = 400//StatusCodes.BAD_REQUEST;
  }
}
export { BadRequestError };
