import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { NotFound, errorHandler } from './libraries/errors/index.js';
import transactionRoutes from './paymob/routes/transactionRoutes.js';
import userRoutes from './components/user/entry-points/api/user.routes.js';
import authUserRoutes from './components/auth/user/entry-points/api/auth.routes.js';
import charityRoutes from './components/charity/entry-points/api/charity.routes.js';
import casesRoutes from './routes/casesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import logger from './utils/logger.js';
const __dirname = path.resolve();
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

app.use('/api/payment', transactionRoutes);
authUserRoutes(app);
userRoutes(app);
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
