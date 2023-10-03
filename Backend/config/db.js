import mongoose from 'mongoose';
import { BadRequestError } from '../errors/index.js';
import asyncHandler from 'express-async-handler';

const connectDB = asyncHandler(async () => {
  // try {
  const dbConnect = await mongoose.connect(process.env.MONGO_URL);
  if (dbConnect === null) throw new Error();
  console.log('mongoDB connected successfully');
  // } catch (err) {
  // throw new BadRequestError(err.message);
  // }
});
export default connectDB;
