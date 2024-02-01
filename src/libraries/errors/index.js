import { CustomAPIError } from './components/custom-api.js';
import logger from '../../utils/logger.js';
import * as configurationProvider from '../configuration-provider/index.js';

const NotFound = (req, res, next) => {
  logger.error('Not Found Error');
  res.status(404); 
  next(new Error(`not found' ${req.originalUrl}`));
};

//global error handling middleware
const errorHandler = (err, req, res, next) => {
  const environment = configurationProvider.getValue('environment.nodeEnv');

  const stack = environment === 'development' ? err.stack : null;

    logger.error('Reached error handler');

    if (err instanceof CustomAPIError) {
        logger.error('instance of custom api error');

        return res.status(err.statusCode || 500).json({
            message: err.message || 'error happened try again later',
            stack
        });

    } else {
        if (err.path === '_id') {
            res.status(500).json({
                message: 'Invalid Id ..try again later',
                stack
            });
        } else {
            logger.error('still in error handler');
            
            res.status(
                err.statusCode === 200 || !err.statusCode ? 500 : err.statusCode
            ).json({
                message: err.message || 'error happened try again later',
                stack
            });
        }
    }
};

export { NotFound, errorHandler };
