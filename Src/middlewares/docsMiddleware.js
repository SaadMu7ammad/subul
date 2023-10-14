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
async function processDocs(docsKey,ref, req) {
  
  return Promise.all(
    ref.map(async (obj, indx) => {
      const ex = obj.mimetype.split('/')[1];
      const uniquePrefix = uuidv4();
      const filename =
        `${docsKey}-${req.charity.name}--${req.charity._id}--${indx}${uniquePrefix}.jpeg`;

      await sharp(obj.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./uploads/docsCharities/` + filename);
        if(docsKey==='docs1') req.body.charityDocs.docs1.push(filename);
        if(docsKey==='docs2') req.body.charityDocs.docs2.push(filename);
        if(docsKey==='docs3') req.body.charityDocs.docs3.push(filename);
        if(docsKey==='docs4') req.body.charityDocs.docs4.push(filename);

      // body.charityDocs = { ...body.charityDocs, [docsKey]: filename };
    })
  )//.then(() => next());
}
// req.files['charityDocs[docs1]'].map((obj, indx)
const resizeDoc = asyncHandler(async (req, res, next) => {
  req.body.charityDocs={}
  // await Promise.all(
  //   req.files['charityDocs[docs1]'].map(async (obj, indx) => {
  //     const ex = obj.mimetype.split('/')[1];
  //     const uniquePrefix = uuidv4();
  //     const filename =
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
  //       .toFile(`./uploads/docsCharities/` + filename); //, (err, info) => {
  //     //   console.log('err');
  //     //   console.log(err);
  //     // });
  //     //adding the filename in the req.body
  //     // req.body.image = filename;
  //     // console.log(req.files);
  //     req.body.charityDocs = { docs1: filename };
  //     console.log(filename);
  //     console.log('body');
  //     console.log(req.body.charityDocs);
  //     // next();
  //   })
  // );



  // console.log(typeof(req.files));//obj
  // req.files['charityDocs[docs1]'].map((obj, indx) => {
  //   console.log(obj.buffer);
  // });
  req.body.charityDocs={}
  req.body.charityDocs.docs1=[]
  req.body.charityDocs.docs2=[]
  req.body.charityDocs.docs3=[]
  req.body.charityDocs.docs4=[]
  await processDocs('docs1', req.files['charityDocs[docs1]'], req);
  await processDocs('docs2', req.files['charityDocs[docs2]'], req);
  await processDocs('docs3', req.files['charityDocs[docs3]'], req);
  await processDocs('docs4', req.files['charityDocs[docs4]'], req);

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
]);

export { uploadDocs, resizeDoc };
