import { CustomAPIError } from './custom-api.js';

class NotFoundError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404// StatusCodes.NOT_FOUND;
  }
}

export { NotFoundError };
