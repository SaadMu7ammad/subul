//disk Storage solution
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, 'uploads/');
//     cb(null, './uploads/LogoCharities');
//   },
//   filename: function (req, file, cb) {
//     // const imageUrl = file.path.replace("\\", "/");
//     const ex = file.mimetype.split('/')[1];
//     const uniqueSuffix ="LogoCharity"+uuidv4()+"-"+ Date.now() ;
//     cb(null, uniqueSuffix + '.' + ex);
//   },
// });

import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import logger from '../utils/logger.js';
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
const resizeImg = asyncHandler(async (req, res, next) => {
  // const ex = file.mimetype.split('/')[1];
  const uniqueSuffix = 'LogoCharity' + uuidv4() + '-' + Date.now();
  const filename = uniqueSuffix + '.jpeg';
  await sharp(req.file.buffer)
  .resize(320, 240)
  .toFormat('jpeg')
  .jpeg({ quality: 90 })
  .toFile('./uploads/LogoCharities/' + filename); //, (err, info) => {
    //   console.log('err');
    //   console.log(err);
    // });
    //adding the filename in the req.body
    logger.warn('???')
  req.body.image = filename;
  next();
});
//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadCoverImage = upload.single('image');

export { uploadCoverImage, resizeImg };
