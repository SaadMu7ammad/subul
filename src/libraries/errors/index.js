import { CustomAPIError } from './components/custom-api.js';
import logger from '../../utils/logger.js';
import * as configurationProvider from '../configuration-provider/index.js';

//global error handling middleware
const NotFound = (req, res, next) => {
    logger.error('Not Found Error');
    res.status(404); //.json({ message: 'page not found' });
    next(new Error(`not found' ${req.originalUrl}`));
};
const errorHandler = (err, req, res, next) => {
    const environment = configurationProvider.getValue('environment.nodeEnv');

    // console.log(err);
    logger.error('Reached error handler');
    if (err instanceof CustomAPIError) {
        logger.error('instanse of custom api error');
        return res.status(err.statusCode || 500).json({
            message: err.message || 'error happened try again later',
            stack: environment !== 'production' ? null : err.stack,
        });
    } else {
        // console.log(err);
        if (err.path === '_id') {
            res.status(500).json({
                message: 'Ivalid Id ..try again later',
                stack: environment !== 'production' ? null : err.stack,
            });
        } else {
            logger.error('still in error handler');
            // console.log(err.message);
            // console.log(err.statusCode);
            res.status(
                err.statusCode === 200 || !err.statusCode ? 500 : err.statusCode
            ).json({
                message: err.message || 'error happened try again later',
                stack: environment !== 'production' ? null : err.stack,
            });
        }
    }
};

export { NotFound, errorHandler };
