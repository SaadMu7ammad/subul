//Routes 🛣️
import adminRoutes from '@components/admin/entry-points/api/admin.routes';
import authCharityRoutes from '@components/auth/charity/entry-points/api/auth.routes';
import authUserRoutes from '@components/auth/user/entry-points/api/auth.routes';
import casesRoutes from '@components/case/entry-points/api/case.routes';
import charityRoutes from '@components/charity/entry-points/api/charity.routes';
import chatRoutes from '@components/chat/entry-points/api/chat.routes';
import notificationRoutes from '@components/notification/entry-points/api/notification.routes';
import transactionRoutes from '@components/transaction/entry-points/api/transaction.routes';
import usedItemRoutes from '@components/used-items/entry-points/api/used-item.routes';
import userRoutes from '@components/user/entry-points/api/user.routes';
// Configuration ⚙️
import configurationSchema from '@config/config';
import connectDB from '@config/db';
import * as configurationProvider from '@libs/configuration-provider/index';
// Errors ⛔️
import { NotFound, errorHandler } from '@libs/errors/index';
// Logger 📝
import logger from '@utils/logger';
import { authSocketMiddleware } from '@utils/socket-io';
// Packages 📦️
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { Server as HTTPServer, createServer } from 'http';
import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';
// Imports the i18next HTTP middleware for use with Express.
import i18nextHttpMiddleware from 'i18next-http-middleware';
import { AddressInfo } from 'net';
import * as path from 'path';
import { Server as SocketIOServer } from 'socket.io';

i18next
  .use(FsBackend) // Uses the file system backend to load translation files.
  .use(i18nextHttpMiddleware.LanguageDetector) // Uses the language detector middleware to detect the user's language based on headers, cookies, or URL paths.
  .init({
    fallbackLng: 'en', // the default fallback language
    preload: ['en', 'ar'], // Preload languages
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['header'], // Use the 'Accept-Language' header
      lookupHeader: 'accept-language',
    },
  });

dotenv.config();

let connection: HTTPServer;
export let io: SocketIOServer;

export async function startWebServer() {
  dotenv.config();

  configurationProvider.initializeAndValidate(configurationSchema);

  const app: Application = express();

  // Use i18next middleware
  app.use(i18nextHttpMiddleware.handle(i18next));

  //to access the img as path http://localhost:5000/charityLogos/imgName_In_DB.jpeg
  //http://localhost:5000/charityDocs/docs1-sss--.jpeg
  app.use(express.static(path.join(__dirname, `uploads`)));

  const allowedOrigins = ['https://charity-proj.netlify.app', 'https://subul.me'];

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials
  };

  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true })); //form data
  app.use(express.json());

  defineRoutes(app);

  app.get('/', (req, res) => {
    res.send('Welcome To Subul API 👋');
  });

  app.use(NotFound);
  app.use(errorHandler);

  // eslint-disable-next-line @typescript-eslint/naming-convention
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

    connection = createServer(expressApp);

    io = new SocketIOServer(connection, {
      cors: {
        origin: 'https://subul.me',
        credentials: true,
      },
    });

    io.use(authSocketMiddleware);

    io.on('connection', socket => {
      console.log('New client connected');

      const userId = (socket as any).userId;
      const charityId = (socket as any).charityId;

      if (userId) {
        socket.join(`User-${userId}`);
        console.log(`User with ID ${userId} joined room User-${userId}`);
      }

      if (charityId) {
        socket.join(`Charity-${charityId}`);
        console.log(`Charity with ID ${charityId} joined room Charity-${charityId}`);
      }

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    connection.listen(webServerPort, () => {
      logger.info(`Server is listening to port ${webServerPort} 🚀`);
      resolve(connection.address() as AddressInfo);
    });
  });
}

const defineRoutes = (app: Application) => {
  transactionRoutes(app);
  authUserRoutes(app);
  authCharityRoutes(app);
  charityRoutes(app);
  adminRoutes(app);
  userRoutes(app);
  casesRoutes(app);
  usedItemRoutes(app);
  chatRoutes(app);
  notificationRoutes(app);
};
