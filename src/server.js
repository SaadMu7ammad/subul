//Packages 📦️
import * as path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
//Configuration ⚙️
import * as configurationProvider from './libraries/configuration-provider/index.js';
import configurationSchema from './config/config.js';
//Errors ⛔️
import { NotFound, errorHandler } from './libraries/errors/index.js';
//Routes 🛤️
import transactionRoutes from './libraries/paymob/routes/transactionRoutes.js';
import userRoutes from './components/user/entry-points/api/user.routes.js';
import authUserRoutes from './components/auth/user/entry-points/api/auth.routes.js';
import authCharityRoutes from './components/auth/charity/entry-points/api/auth.routes.js';
import charityRoutes from './components/charity/entry-points/api/charity.routes.js';
import casesRoutes from './components/case/entry-points/api/case.routes.js';
import adminRoutes from './components/admin/entry-points/api/admin.routes.js';

configurationProvider.initializeAndValidate(configurationSchema);

const __dirname = path.resolve();
const port = configurationProvider.getValue('environment.port');
const host = configurationProvider.getValue('environment.host');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); //form data
app.use(express.json());

//to access the img as path http://localhost:5000/LogoCharities/imgName_In_DB.jpeg
//http://localhost:5000/docsCharities/docs1-sss--.jpeg
app.use(express.static(path.join(__dirname, `uploads`)));
// app.use('/uploads',express.static( `uploads`));

app.use(cookieParser());

app.use('/api/payment', transactionRoutes);
authUserRoutes(app);
authCharityRoutes(app);
charityRoutes(app);
adminRoutes(app);
userRoutes(app);
casesRoutes(app);

// app.use('/api/charities', charityRoutes);

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
