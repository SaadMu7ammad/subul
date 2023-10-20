
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
async function processDocReq(docsKey, ref, req) {
  return Promise.all(
    ref.map(async (obj, indx) => {
      const ex = obj.mimetype.split('/')[1];
      const uniquePrefix = uuidv4();
      const filename = `${docsKey}-${req.charity.name}--${req.charity._id}--${indx}${uniquePrefix}.jpeg`;

      await sharp(obj.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./uploads/reqDocsCharities/` + filename);
      // if (docsKey === 'docs1') req.body.charityDocs.docs1.push(filename);
      // if (docsKey === 'docs2') req.body.charityDocs.docs2.push(filename);
      // if (docsKey === 'docs3') req.body.charityDocs.docs3.push(filename);
      if (docsKey === 'docs') req.body.charityReqDocs.docs.push(filename);

      // body.charityDocs = { ...body.charityDocs, [docsKey]: filename };
    })
  ); //.then(() => next());
}
// req.files['charityDocs[docs1]'].map((obj, indx)
const resizeDocReq = asyncHandler(async (req, res, next) => {
  req.body.charityDocs = {};

  req.body.charityReqDocs = {};
  req.body.charityReqDocs.docs = [];
  // req.body.charityDocs.docs2 = [];
  // req.body.charityDocs.docs3 = [];
  // req.body.charityDocs.docs4 = [];
  if (!req.files) {
    throw new BadRequestError('docs are required');
  }
  if (//if not upload docs
    !req.files['charityReqDocs[docs]'] 
    // !req.files['charityDocs[docs2]'] ||
    // !req.files['charityDocs[docs3]'] ||
    // !req.files['charityDocs[docs4]']
  ) {
    throw new BadRequestError('docs are required');
  }
  await processDocReq('docs', req.files['charityReqDocs[docs]'], req);
  // await processDocReq('docs2', req.files['charityDocs[docs2]'], req);
  // await processDocReq('docs3', req.files['charityDocs[docs3]'], req);
  // await processDocReq('docs4', req.files['charityDocs[docs4]'], req);

  next();
});
//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadDocsReq = upload.fields([
  // { name: 'charityDocs[docs1]', maxCount: 2 }
  // { name: 'charityDocs[docs2]', maxCount: 2 },
  // { name: 'charityDocs[docs3]', maxCount: 2 },
  { name: 'charityReqDocs[docs]', maxCount: 10 }
]);

export { uploadDocsReq, resizeDocReq };
