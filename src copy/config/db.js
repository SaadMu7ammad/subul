import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGO_URL);
    logger.info('mongoDB connected successfully');
  } catch (err) {
    // throw new BadRequestError(err.message);
    logger.info(`DataBase Error: ${err}`);
    process.exit(1);
  }
};
export default connectDB;
