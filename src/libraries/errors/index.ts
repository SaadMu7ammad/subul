import { NextFunction, Request, Response } from 'express';

import logger from '../../utils/logger';
import * as configurationProvider from '../configuration-provider/index';
import { CustomAPIError } from './components/custom-api';
import { IError } from './components/error.interface';

const NotFound = (req: Request, res: Response, next: NextFunction) => {
  logger.error('Not Found Error');
  res.status(404);
  next(new Error(`${req.originalUrl}  Route Is Not Found `));
};

//global error handling middleware
const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const environment = configurationProvider.getValue('environment.nodeEnv');

  const stack = environment === 'development' ? err.stack : null;

  logger.error('Reached error handler');

  if (err instanceof CustomAPIError) {
    logger.error('instance of custom api error');

    return res.status(err.statusCode || 500).json({
      message: err.message || 'error happened try again later',
      stack,
    });
  } else {
    if (err.path === '_id') {
      res.status(500).json({
        message: 'Invalid Id ..try again later',
        stack,
      });
    } else {
      logger.error('still in error handler');

      res.status(err.statusCode === 200 || !err.statusCode ? 500 : err.statusCode).json({
        message: err.message || 'error happened try again later',
        stack,
      });
    }
  }
};

export { NotFound, errorHandler };
