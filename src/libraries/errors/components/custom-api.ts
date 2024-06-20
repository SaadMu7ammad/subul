import logger from '@utils/logger';

class CustomAPIError extends Error {
  statusCode: number;
  constructor(message: string) {
    logger.info('CustomAPIError');
    super(message);
    this.statusCode = 500;
  }
}

export { CustomAPIError };
