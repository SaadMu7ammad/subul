//Packages 📦️
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
import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';
// Imports the i18next HTTP middleware for use with Express.
import i18nextHttpMiddleware from 'i18next-http-middleware';
import * as path from 'path';

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

// Use i18next middleware
app.use(i18nextHttpMiddleware.handle(i18next));
// app.get('/test', (req, res) => {
//   res.send(req.t('errors.notAdmin'));
// });

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
