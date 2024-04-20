//Packages 📦️
import * as path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import logger from './utils/logger';
//Configuration ⚙️
import * as configurationProvider from './libraries/configuration-provider/index';
import configurationSchema from './config/config';
//Errors ⛔️
import { NotFound, errorHandler } from './libraries/errors/index';
//Routes 🛤️
import transactionRoutes from './components/transaction/entry-points/api/transaction.routes';
import userRoutes from './components/user/entry-points/api/user.routes';
import authUserRoutes from './components/auth/user/entry-points/api/auth.routes';
import authCharityRoutes from './components/auth/charity/entry-points/api/auth.routes';
import charityRoutes from './components/charity/entry-points/api/charity.routes';
import casesRoutes from './components/case/entry-points/api/case.routes';
// import adminRoutes from './components/admin/entry-points/api/admin.routes';

dotenv.config();

configurationProvider.initializeAndValidate(configurationSchema);

// const __dirname = path.resolve();
const port: number = configurationProvider.getValue('environment.port');
const host: string = configurationProvider.getValue('environment.host');

const app: Application = express();
app.use(
  cors({
    origin: 'https://charity-proj.netlify.app',
    credentials: true, // Allow credentials
  })
);
app.use(express.urlencoded({ extended: true })); //form data
app.use(express.json());

//to access the img as path http://localhost:5000/charityLogos/imgName_In_DB.jpeg
//http://localhost:5000/charityDocs/docs1-sss--.jpeg
app.use(express.static(path.join(__dirname, `uploads`)));
// app.use('/uploads',express.static( `uploads`));

transactionRoutes(app);
authUserRoutes(app);
authCharityRoutes(app);
charityRoutes(app);
// adminRoutes(app);
userRoutes(app);
casesRoutes(app);

app.get('/', (req, res) => {
  res.send('Welcome To Subul API 👋');
});

app.use(NotFound);
app.use(errorHandler);
const server = async () => {
  await connectDB();
  app.listen(port, () => {
    logger.info(`server is listenting http://${host}:${port}`);
  });
};
server();
//handling errors outside express
// process.on('unhandledRejection', (err) => {
//   console.log(`unhandledRejection Errors + ${err.name} | ${err.message}`);
//   server.close(() => {
//     //do exit to the program after the server their pending requests
//     console.log('shutting down...');
//     process.exit(1);
//   });
// });
