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
import { BadRequestError } from '../errors/bad-request.js';
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
async function processDocs(docsKey, ref, req) {
  return Promise.all(
    ref.map(async (obj, indx) => {
      const ex = obj.mimetype.split('/')[1];
      const uniquePrefix = uuidv4();
      const filename = `${docsKey}-${req.charity.name}--${req.charity._id}--${indx}${uniquePrefix}.jpeg`;
      req.temp.push(filename);
      await sharp(obj.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./uploads/docsCharities/` + filename);

      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.bankAccount &&
        docsKey === 'docsBank'
      ) {
        req.body.paymentMethods.bankAccount.docsBank.push(filename);
      }
      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.fawry &&
        docsKey === 'docsFawry'
      ) {
        req.body.paymentMethods.fawry.docsFawry.push(filename);
      }
      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.vodafoneCash &&
        docsKey === 'docsVodafoneCash'
      ) {
        req.body.paymentMethods.vodafoneCash.docsVodafoneCash.push(filename);
      }

      // body.charityDocs = { ...body.charityDocs, [docsKey]: filename };
    })
  ); //.then(() => next());
}
// req.files['charityDocs[docs1]'].map((obj, indx)
const resizeDocReq = asyncHandler(async (req, res, next) => {
  req.temp = []; //container for deleting imgs

  // req.body.paymentMethods.bankAccount={}

  // req.body.paymentMethods.bankAccount ?  : null
  if (req.body.paymentMethods && req.body.paymentMethods.bankAccount) {
    req.body.paymentMethods.bankAccount.docsBank = [];
  }
  if (req.body.paymentMethods && req.body.paymentMethods.fawry) {
    req.body.paymentMethods.fawry.docsFawry = [];
  }
  if (req.body.paymentMethods && req.body.paymentMethods.vodafoneCash) {
    req.body.paymentMethods.vodafoneCash.docsVodafoneCash = [];
  }

  // req.body.paymentMethods.fawry.docs = [];
  if (!req.files) {
    throw new BadRequestError('docs are required');
  }
  console.log(req.files);
  if (
    //if not upload docs
    !req.files['paymentMethods.bankAccount[0][docsBank]'] &&
    !req.files['paymentMethods.fawry[0][docsFawry]'] &&
    !req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]']
  ) {
    throw new BadRequestError('docs are required');
  }

  if (req.files['paymentMethods.bankAccount[0][docsBank]'])
    await processDocs(
      'docsBank',
      req.files['paymentMethods.bankAccount[0][docsBank]'],
      req
    );

  if (req.files['paymentMethods.fawry[0][docsFawry]'])
    await processDocs(
      'docsFawry',
      req.files['paymentMethods.fawry[0][docsFawry]'],
      req
    );

  if (req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]'])
    await processDocs(
      'docsVodafoneCash',
      req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]'],
      req
    );

  // await processDocs('docs', req.files[' paymentMethods[fawry][0][docs]'], req);

  next();
});

//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadDocsReq = upload.fields([
  { name: 'paymentMethods.bankAccount[0][docsBank]', maxCount: 2 },
  { name: 'paymentMethods.fawry[0][docsFawry]', maxCount: 2 },
  { name: 'paymentMethods.vodafoneCash[0][docsVodafoneCash]', maxCount: 2 },

  // { name: 'paymentMethods.fawry[0][docs]', maxCount: 2 },
  // { name: 'paymentMethods.vodafoneCash[0][docs]', maxCount: 2 },
]);

export { uploadDocsReq, resizeDocReq };
