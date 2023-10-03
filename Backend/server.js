import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import {
  NotFound,
  errorHandler,
} from './middlewares/errorHandlerMiddleware.js';
import userRoutes from './Routes/userRoutes.js';
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form data
app.use(cookieParser())
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('hello saadoon');
});
app.use(NotFound);
app.use(errorHandler);
// const start = async () => {
//   // console.log('server is listenting now on port ' + port);

// }
// start()

await connectDB();
app.listen(port, () => {
  console.log('server is listenting now on port ' + port);
});
