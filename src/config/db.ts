import mongoose from 'mongoose';

import * as configurationProvider from '../libraries/configuration-provider/index';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(configurationProvider.getValue('DB.url'));
    logger.info('mongoDB connected successfully');
  } catch (err) {
    // throw new BadRequestError(err.message);
    logger.info(`DataBase Error: ${err}`);
    process.exit(1);
  }
};
export default connectDB;
