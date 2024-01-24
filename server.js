import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './Src/config/db.js';
import cookieParser from 'cookie-parser';
import {
  NotFound,
  errorHandler,
} from './Src/middlewares/errorHandlerMiddleware.js';
import userRoutes from './Src/Routes/userRoutes.js';
import charityRoutes from './Src/Routes/charityRoutes.js';
import casesRoutes from './Src/Routes/casesRoutes.js';
import adminRoutes from './Src/Routes/adminRoutes.js';
import transactionRoutes from './Src/paymob/Routes/transaction.Routes.js';
import logger from './Src/utils/logger.js';
// const imageUrl = req.file.path.replace("\\" ,"/");
const __dirname = path.resolve();
// import { CreateAuthenticationRequest } from './paymob/paymob.service.js';

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();
app.use(express.urlencoded({ extended: true })); //form data
app.use(express.json());

//to access the img as path http://localhost:5000/LogoCharities/imgName_In_DB.jpeg
//http://localhost:5000/docsCharities/docs1-sss--.jpeg
app.use(express.static(path.join(__dirname, `uploads`)));
// app.use('/uploads',express.static( `uploads`));

app.use(cookieParser());
// app.get('/callback', async (req, res, next) => {
//   res.send({ query: req.query });
// });
// app.post('/callback', async (req, res, next) => {
//   res.send({ method: 'POST', body: req.body });
// });
app.use('/api/payment', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/charities', casesRoutes);
app.use('/api/admin', adminRoutes);
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
