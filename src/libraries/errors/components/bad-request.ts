import logger from '@utils/logger';

import { CustomAPIError } from './custom-api';

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    logger.error('BadRequestError');
    this.statusCode = 400;
  }
}
export { BadRequestError };
