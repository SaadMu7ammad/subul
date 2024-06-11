//Routes 🛤️
import adminRoutes from '@components/admin/entry-points/api/admin.routes';
import authCharityRoutes from '@components/auth/charity/entry-points/api/auth.routes';
import authUserRoutes from '@components/auth/user/entry-points/api/auth.routes';
import casesRoutes from '@components/case/entry-points/api/case.routes';
import charityRoutes from '@components/charity/entry-points/api/charity.routes';
import chatRoutes from '@components/chat/entry-points/api/chat.routes';
import transactionRoutes from '@components/transaction/entry-points/api/transaction.routes';
import usedItemRoutes from '@components/used-items/entry-points/api/used-item.routes';
import userRoutes from '@components/user/entry-points/api/user.routes';
//Configuration ⚙️
import configurationSchema from '@config/config';
import connectDB from '@config/db';
import * as configurationProvider from '@libs/configuration-provider/index';
//Errors ⛔️
import { NotFound, errorHandler } from '@libs/errors/index';
//Logger 📝
import logger from '@utils/logger';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
//Packages 📦️
import { Server } from 'http';
import { AddressInfo } from 'net';
import * as path from 'path';

let connection: Server;

export async function startWebServer() {
  dotenv.config();

  configurationProvider.initializeAndValidate(configurationSchema);

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
  adminRoutes(app);
  userRoutes(app);
  casesRoutes(app);
  usedItemRoutes(app);
  chatRoutes(app);

  app.get('/', (req, res) => {
    res.send('Welcome To Subul API 👋');
  });

  app.use(NotFound);
  app.use(errorHandler);

  const APIAddress = await openConnection(app);
  return APIAddress;
}

export async function stopWebServer() {
  return new Promise<void>(resolve => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

export async function openConnection(expressApp: express.Application): Promise<AddressInfo> {
  const portToListenTo = configurationProvider.getValue('environment.port');

  const webServerPort = portToListenTo || 0;

  await connectDB();

  return new Promise(resolve => {
    logger.info(`Server is about to listen to port ${webServerPort}`);

    connection = expressApp.listen(webServerPort, () => {
      logger.info(`server is listening to port ${webServerPort} 🚀`);
      resolve(connection.address() as AddressInfo);
    });
  });
}

//handling errors outside express
// process.on('unhandledRejection', (err) => {
//   console.log(`unhandledRejection Errors + ${err.name} | ${err.message}`);
//   server.close(() => {
//     //do exit to the program after the server their pending requests
//     console.log('shutting down...');
//     process.exit(1);
//   });
// });