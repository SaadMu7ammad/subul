import { CustomAPIError } from './custom-api';

class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401//StatusCodes.UNAUTHORIZED;
  }
}

export { UnauthenticatedError };
