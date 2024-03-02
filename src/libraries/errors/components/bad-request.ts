import { CustomAPIError } from './custom-api';

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    console.log('BadRequestError');
    this.statusCode = 400//StatusCodes.BAD_REQUEST;
  }
}
export { BadRequestError };
