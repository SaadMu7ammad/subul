import { CustomAPIError } from './custom-api.js';

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401//StatusCodes.UNAUTHORIZED;
  }
}

export { UnauthenticatedError };
