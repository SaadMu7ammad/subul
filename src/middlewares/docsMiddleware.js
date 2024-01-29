//disk Storage solution
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, 'uploads/');
//     cb(null, './uploads/LogoCharities');
//   },
//   fileName: function (req, file, cb) {
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
import { BadRequestError } from '../errors/components/bad-request.js';
import { saveImg } from './imageMiddleware.js';

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
      const fileName = `${docsKey}-${req.charity.name}--${req.charity._id}--${indx}${uniquePrefix}.jpeg`;
      req.temp.push(fileName);

      const sharpPromise = sharp(obj.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 });

      await saveImg(sharpPromise, 'docsCharities', fileName);

      if (docsKey === 'docs1') req.body.charityDocs.docs1.push(fileName);
      if (docsKey === 'docs2') req.body.charityDocs.docs2.push(fileName);
      if (docsKey === 'docs3') req.body.charityDocs.docs3.push(fileName);
      if (docsKey === 'docs4') req.body.charityDocs.docs4.push(fileName);
      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.bankAccount &&
        docsKey === 'docsBank'
      ) {
        req.body.paymentMethods.bankAccount.docsBank.push(fileName);
      }
      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.fawry &&
        docsKey === 'docsFawry'
      ) {
        req.body.paymentMethods.fawry.docsFawry.push(fileName);
      }
      if (
        req.body.paymentMethods &&
        req.body.paymentMethods.vodafoneCash &&
        docsKey === 'docsVodafoneCash'
      ) {
        req.body.paymentMethods.vodafoneCash.docsVodafoneCash.push(fileName);
      }

      // body.charityDocs = { ...body.charityDocs, [docsKey]: fileName };
    })
  ); //.then(() => next());
}
// req.files['charityDocs[docs1]'].map((obj, indx)
const resizeDoc = asyncHandler(async (req, res, next) => {
  req.temp = []; //container for deleting imgs

  req.body.charityDocs = {};
  // await Promise.all(
  //   req.files['charityDocs[docs1]'].map(async (obj, indx) => {
  //     const ex = obj.mimetype.split('/')[1];
  //     const uniquePrefix = uuidv4();
  //     const fileName =
  //       'docs-' +
  //       req.charity.name +
  //       '--' +
  //       req.charity._id +
  //       '--' +
  //       indx +
  //       uniquePrefix +
  //       '.jpeg';

  //     await sharp(obj.buffer)
  //       .resize(320, 240)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`./uploads/docsCharities/` + fileName); //, (err, info) => {
  //     //   console.log('err');
  //     //   console.log(err);
  //     // });
  //     //adding the fileName in the req.body
  //     // req.body.image = fileName;
  //     // console.log(req.files);
  //     req.body.charityDocs = { docs1: fileName };
  //     console.log(fileName);
  //     console.log('body');
  //     console.log(req.body.charityDocs);
  //     // next();
  //   })
  // );

  // console.log(typeof(req.files));//obj
  // req.files['charityDocs[docs1]'].map((obj, indx) => {
  //   console.log(obj.buffer);
  // });
  // console.log(req.files);
  req.temp = []; //container for deleting imgs

  req.body.charityDocs = {};
  // req.body.paymentMethods.bankAccount={}
  req.body.charityDocs.docs1 = [];
  req.body.charityDocs.docs2 = [];
  req.body.charityDocs.docs3 = [];
  req.body.charityDocs.docs4 = [];
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
  if (
    //if not upload docs
    !req.files['charityDocs[docs1]'] ||
    !req.files['charityDocs[docs2]'] ||
    !req.files['charityDocs[docs3]'] ||
    (!req.files['charityDocs[docs4]'] &&
      (!req.files['paymentMethods.bankAccount[0][docsBank]'] ||
        !req.files['paymentMethods.fawry[0][docsFawry]'] ||
        !req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]']))
    // !req.files[' paymentMethods[fawry][0]']
  ) {
    throw new BadRequestError('docs are required');
  }
  await processDocs('docs1', req.files['charityDocs[docs1]'], req);
  await processDocs('docs2', req.files['charityDocs[docs2]'], req);
  await processDocs('docs3', req.files['charityDocs[docs3]'], req);
  await processDocs('docs4', req.files['charityDocs[docs4]'], req);
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
const uploadDocs = upload.fields([
  { name: 'charityDocs[docs1]', maxCount: 2 },
  { name: 'charityDocs[docs2]', maxCount: 2 },
  { name: 'charityDocs[docs3]', maxCount: 2 },
  { name: 'charityDocs[docs4]', maxCount: 10 },
  { name: 'paymentMethods.bankAccount[0][docsBank]', maxCount: 2 },
  { name: 'paymentMethods.fawry[0][docsFawry]', maxCount: 2 },
  { name: 'paymentMethods.vodafoneCash[0][docsVodafoneCash]', maxCount: 2 },

  // { name: 'paymentMethods.fawry[0][docs]', maxCount: 2 },
  // { name: 'paymentMethods.vodafoneCash[0][docs]', maxCount: 2 },
]);

export { uploadDocs, resizeDoc };
