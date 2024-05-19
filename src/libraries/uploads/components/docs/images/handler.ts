import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { deleteOldImgs } from '../../../../../utils/deleteFile';
import { BadRequestError } from '../../../../errors/components/index';
import { saveImg } from '../../index';

//memoryStorage
const multerStorage = multer.memoryStorage();
const multerFilterOnlyImgs = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterOnlyImgs,
});
type uploadDocsSchema =
  | 'charityDocs1'
  | 'charityDocs2'
  | 'charityDocs3'
  | 'charityDocs4'
  | 'bankDocs'
  | 'fawryDocs'
  | 'vodafoneDocs';
type charityDocsSchema = 'charityDocs1' | 'charityDocs2' | 'charityDocs3' | 'charityDocs4';

// type paymentDocsSchema =
//     'bankDocs' |
//     'fawryDocs' |
// 'vodafoneDocs'

const uploadCharityDocsIterable = [
  'charityDocs1',
  'charityDocs2',
  'charityDocs3',
  'charityDocs4',
] as const;

// const uploadPaymentDocsIterable = [
//     'bankDocs',
//     'fawryDocs',
//     'vodafoneDocs'
// ];
const uploadDocs = upload.fields([
  { name: 'charityDocs1', maxCount: 2 },
  { name: 'charityDocs2', maxCount: 2 },
  { name: 'charityDocs3', maxCount: 2 },
  { name: 'charityDocs4', maxCount: 10 },
  { name: 'bankDocs', maxCount: 2 },
  { name: 'fawryDocs', maxCount: 2 },
  { name: 'vodafoneDocs', maxCount: 2 },
]);

export async function processDocs(
  docsKey: uploadDocsSchema,
  ref: Express.Multer.File[],
  req: Request,
  res: Response
) {
  return Promise.all(
    ref.map(async (obj, indx: number) => {
      // const ex = obj.mimetype.split('/')[1];
      const uniquePrefix: string = uuidv4();
      const fileName: string = `${docsKey}-${res.locals.charity.name}--${res.locals.charity._id}--${indx}--${uniquePrefix}.jpeg`;
      const sharpPromise = sharp(obj.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 });

      await saveImg(sharpPromise, 'charityDocs', fileName);

      if (docsKey === 'charityDocs1') req.body.charityDocs.docs1.push(fileName);
      if (docsKey === 'charityDocs2') req.body.charityDocs.docs2.push(fileName);
      if (docsKey === 'charityDocs3') req.body.charityDocs.docs3.push(fileName);
      if (docsKey === 'charityDocs4') req.body.charityDocs.docs4.push(fileName);
      if (docsKey === 'bankDocs') req.body.paymentMethods.bankAccount.bankDocs.push(fileName);
      if (docsKey === 'fawryDocs') req.body.paymentMethods.fawry.fawryDocs.push(fileName);
      if (docsKey === 'vodafoneDocs')
        req.body.paymentMethods.vodafoneCash.vodafoneCashDocs.push(fileName);
    })
  );
}

function assertFiles(file: any): asserts file is uploadDocsSchema {
  if (file && file.length > 0) {
    return file;
  } else {
    throw new BadRequestError('bad type of file or not uploaded all docs');
  }
}
function checkFilesCharityDocs(key: charityDocsSchema, file: charityDocsSchema) {
  if (key === file) {
    if (file && file.length > 0) {
      return file;
    } else {
      throw new BadRequestError('not uploaded all docs');
    }
  } else {
    throw new BadRequestError('not completed files');
  }
}
// function checkFilesPaymentMethod(file: any) {

//     if (file && file.length > 0) {
//         return file;
//     } else {
//         throw new BadRequestError('not uploaded all docs')

//     }

// }

const resizeDoc = async (req: Request, res: Response, next: NextFunction) => {
  if (
    res.locals.charity.isPending ||
    !res.locals.charity.isEnabled ||
    res.locals.charity.isConfirmed
  ) {
    return next(new BadRequestError('you cant do this right now'));
  }
  try {
    req.body.charityDocs = {
      docs1: [],
      docs2: [],
      docs3: [],
      docs4: [],
    };
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
    let tot = 0; //must reach 3
    for (const [key] of Object.entries(req.files)) {
      console.log(key);
      assertFiles(key);
      if (key === 'bankDocs' || key == 'fawryDocs' || key == 'vodafoneDocs') {
        flag = true;
      }
      if (!flag) throw new BadRequestError('not completed input for payment methods');
      else if (
        key === 'charityDocs1' ||
        key == 'charityDocs2' ||
        key == 'charityDocs3' ||
        key == 'charityDocs4'
      ) {
        tot++;
      }
    }
    if (tot !== uploadCharityDocsIterable.length) {
      throw new BadRequestError('not completed data provided');
    }
    let flagPaymentMethodsUploaded = false;
    let i = 0;
    for (const [key, val] of Object.entries(req.files)) {
      console.log(i);
      assertFiles(key);
      if (key === 'bankDocs' || key == 'fawryDocs' || key == 'vodafoneDocs') {
        // checkFilesPaymentMethod(key)
        await processDocs(key, val, req, res);

        flagPaymentMethodsUploaded = true;
      }
      if (!flagPaymentMethodsUploaded)
        throw new BadRequestError('not completed input for payment methods');
      else if (
        key === 'charityDocs1' ||
        key == 'charityDocs2' ||
        key == 'charityDocs3' ||
        key == 'charityDocs4'
      ) {
        const fixedVal: charityDocsSchema | undefined = uploadCharityDocsIterable[i]; // Ensure key is of type charityDocsSchema
        if (fixedVal) {
          checkFilesCharityDocs(fixedVal, key);
          await processDocs(key, val, req, res);
        }
        ++i;
      }
    }

    next();
  } catch (error) {
    //add it here coz the resizeDoc middleware in the routes outside the try catch
    deleteOldImgs('charityDocs', req?.body?.charityDocs1);
    deleteOldImgs('charityDocs', req?.body?.charityDocs2);
    deleteOldImgs('charityDocs', req?.body?.charityDocs3);
    deleteOldImgs('charityDocs', req?.body?.charityDocs4);
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.bankAccount?.bankDocs);
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.fawry?.fawryDocs);
    deleteOldImgs('charityDocs', req?.body?.paymentMethods?.vodafoneCash?.vodafoneCashDocs);
    return next(error);
  }
};

export { uploadDocs, resizeDoc };
