import * as configurationProvider from '@libs/configuration-provider/index';
import logger from '@utils/logger';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let dbUrl;
    if (configurationProvider.getValue('environment.nodeEnv') === 'testing') {
      dbUrl = configurationProvider.getValue('DB.testUrl');
    } else {
      dbUrl = configurationProvider.getValue('DB.url');
    }
    await mongoose.connect(dbUrl);
    logger.info('mongoDB connected successfully');
  } catch (err) {
    // throw new BadRequestError(err.message);
    logger.info(`DataBase Error: ${err}`);
    process.exit(1);
  }
};
export default connectDB;
