import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import {
  NotFound,
  errorHandler,
} from './middlewares/errorHandlerMiddleware.js';
import userRoutes from './Routes/userRoutes.js';
import charityRoutes from './Routes/charityRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import logger from './utils/logger.js';
// const imageUrl = req.file.path.replace("\\" ,"/");
const __dirname = path.resolve();

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true })); //form data
//to access the img as path http://localhost:5000/LogoCharities/imgName_In_DB.jpeg
app.use(express.static(path.join(__dirname, `uploads`)));
// app.use('/uploads',express.static( `uploads`));

app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/charities',charityRoutes);
app.use('/api/admin',adminRoutes);
app.get('/', (req, res) => {
  res.send('subul charity');
});
app.use(NotFound);
app.use(errorHandler);
await connectDB();
const server = app.listen(port, () => {
  logger.info(`server is listenting http://${host}:${port}`);
});
//handling errors outside express
// process.on('unhandledRejection', (err) => {
//   console.log(`unhandledRejection Errors + ${err.name} | ${err.message}`);
//   server.close(() => {
//     //do exit to the program after the server their pending requests
//     console.log('shutting down...');
//     process.exit(1);
//   });
// });
