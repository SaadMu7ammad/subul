import {CustomAPIError} from '../errors/index.js';
const NotFound = (req, res, next) => {
  res.status(404); //.json({ msg: 'page not found' });
  next(new Error(`not found' ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  // console.log(err);
  console.log('err handler2');
  
  if (err instanceof CustomAPIError) {

    console.log('errorHandlerMiddleware1');

    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log('err handler');
  // console.log(err.message);
  // console.log(err.statusCode);
  res
    .status(err.statusCode === 200||!err.statusCode ? 500 : err.statusCode)
    .json({ msg: err.message || 'error happened try again later' });
};

export { NotFound, errorHandler };
