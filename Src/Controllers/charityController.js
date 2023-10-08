import Charity from '../models/charityModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import { setupMailSender } from '../utils/mailer.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// const imageUrl = req.file.path.replace("\\" ,"/");
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logosCharities');
  },
  filename: function (req, file, cb) {
    const ex = file.mimetype.split("/")[1];
    const uniqueSuffix ="XX"+ Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ex);
  },
});
const upload = multer({ storage: multerStorage });
const uploadCoverImage = upload.single('logoImg');

import {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import logger from '../utils/logger.js';
const registerCharity = asyncHandler(async (req, res, next) => {
  const { email, logoImg } = req.body;

  //   logoImg.replace('\\', '/');
  console.log(logoImg);
  let charity = await Charity.findOne({ email });
  if (charity) {
    throw new BadRequestError('An Account with this Email already exists');
  }
  charity = await Charity.create(req.body);
  if (!charity) throw new Error('Something went wrong');
  generateToken(res, charity._id);
  await setupMailSender(
    req,
    'welcome alert',
    'Hi ' +
      charity.name.firstName +
      ' We are happy that you joined our community💚 ... keep spreading goodness with us'
  );
  res.status(201).json({
    _id: charity._id,
    name: charity.name,
    email,
  });
});

const authCharity = (req, res, next) => {};
export { registerCharity, uploadCoverImage };
