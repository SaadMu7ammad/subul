import { BadRequestError } from '@libs/errors/components/bad-request';
import { deleteOldImgs } from '@utils/deleteFile';
import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback, Multer, StorageEngine } from 'multer';

import { processDocs } from './handler';

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
const resizeDocReq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.paymentMethods = {
      bankAccount: {
        enable: false,
        accNumber: req.body.accNumber,
        iban: req.body.iban,
        swiftCode: req.body.swiftCode,
        bankDocs: [],
      },
      fawry: {
        enable: false,
        number: req.body.fawryNumber,
        fawryDocs: [],
      },
      vodafoneCash: {
        enable: false,
        number: req.body.vodafoneNumber,
        vodafoneCashDocs: [],
      },
    };
    //paymentId:req.body.payment_id

    //duplicated now
    delete req.body.accNumber;
    delete req.body.iban;
    delete req.body.swiftCode;
    delete req.body.fawryNumber;
    delete req.body.vodafoneNumber;

    if (!req.files || req.files.length === 0 || Object.keys(req.files).length === 0) {
      throw new BadRequestError('Docs are required');
    }
    //pre check
    let flag = false;
    for (const [key] of Object.entries(req.files)) {
      console.log(key);
      assertFiles(key);
      if (key === 'bankDocs' || key == 'fawryDocs' || key == 'vodafoneDocs') {
        flag = true;
      }
      if (!flag) throw new BadRequestError('not completed input for payment methods');
    }

    let flagPaymentMethodsUploaded = false;
    let i = 0;
    for (const [key, val] of Object.entries(req.files)) {
      console.log(i);
      assertFiles(key);
      if (key === 'bankDocs' || key == 'fawryDocs' || key == 'vodafoneDocs') {
        await processDocs(key, val, req, res);

        flagPaymentMethodsUploaded = true;
      }
      if (!flagPaymentMethodsUploaded)
        throw new BadRequestError('not completed input for payment methods');
    }

    next();
  } catch (error) {
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.bankAccount?.bankDocs);
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.fawry?.fawryDocs);
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.vodafoneCash?.vodafoneCashDocs);
    return next(error);
  }
};
type paymentDocsSchema = 'bankDocs' | 'fawryDocs' | 'vodafoneDocs';
function assertFiles(file: any): asserts file is paymentDocsSchema {
  if (file && file.length > 0) {
    return file;
  } else {
    throw new BadRequestError('bad type of file or not uploaded all docs');
  }
}
//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadDocsReq = upload.fields([
  { name: 'bankDocs', maxCount: 2 },
  { name: 'fawryDocs', maxCount: 2 },
  { name: 'vodafoneDocs', maxCount: 2 },
]);

export { uploadDocsReq, resizeDocReq };
