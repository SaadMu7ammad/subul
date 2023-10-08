import { CustomAPIError } from '../errors/index.js';
import logger from '../utils/logger.js';
//global error handling middleware
const NotFound = (req, res, next) => {
  res.status(404); //.json({ message: 'page not found' });
  next(new Error(`not found' ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  // console.log(err);
  logger.error('Reached error handler');
  if (err instanceof CustomAPIError) {
    logger.error('instanse of custom api error');
    return res
      .status(err.statusCode || 500)
      .json({
        message: err.message || 'error happened try again later',
        stack: process.env.NODE_ENV !== 'production' ? null : err.stack,
      });
  }
  logger.error('still in error handler');
  // console.log(err.message);
  // console.log(err.statusCode);
  res
    .status(err.statusCode === 200 || !err.statusCode ? 500 : err.statusCode)
    .json({
      message: err.message || 'error happened try again later',
      stack: process.env.NODE_ENV !== 'production' ? null : err.stack,
    });
};

export { NotFound, errorHandler };
