import multer,{Multer,StorageEngine,FileFilterCallback} from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from '../../../../errors/components/bad-request';
import { saveImg } from '../../index';
import { NextFunction, Request, Response } from 'express';
const multerFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    if (file.mimetype.startsWith('image')) {
        //accepts imgs only
        cb(null, true);
    } else {
        cb(new BadRequestError('invalid type,Only images allowed'));
    }
};
async function processDocs(docsKey:string, ref:Express.Multer.File[], req:Request,res:Response) {
    return Promise.all(
        ref.map(async (obj, indx) => {
            // const ex = obj.mimetype.split('/')[1];
            const uniquePrefix = uuidv4();
            const fileName = `${docsKey}-${res.locals.charity.name}--${res.locals.charity._id}--${indx}${uniquePrefix}.jpeg`;

            const sharpPromise = sharp(obj.buffer)
                .resize(320, 240)
                .toFormat('jpeg')
                .jpeg({ quality: 90 });

            await saveImg(sharpPromise, 'charityDocs', fileName);

            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.bankAccount &&
                docsKey === 'bankDocs'
            ) {
                req.body.paymentMethods.bankAccount[indx].bankDocs.push(
                    fileName
                );
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.fawry &&
                docsKey === 'fawryDocs'
            ) {
                req.body.paymentMethods.fawry[indx].fawryDocs.push(fileName);
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.vodafoneCash &&
                docsKey === 'vodafoneCashDocs'
            ) {
                req.body.paymentMethods.vodafoneCash[
                    indx
                ].vodafoneCashDocs.push(fileName);
            }
        })
    );
}
const resizeDocReq = async (req:Request & { files: {[fieldname:string]:Express.Multer.File[]}; }
, res:Response, next:NextFunction) => {
    try {
        if (req.body.paymentMethods && req.body.paymentMethods.bankAccount) {
            req.body.paymentMethods.bankAccount[0].bankDocs = [];
        }
        if (req.body.paymentMethods && req.body.paymentMethods.fawry) {
            req.body.paymentMethods.fawry[0].fawryDocs = [];
        }
        if (req.body.paymentMethods && req.body.paymentMethods.vodafoneCash) {
            req.body.paymentMethods.vodafoneCash[0].vodafoneCashDocs = [];
        }

        if (!req.files) {
            throw new BadRequestError('docs are required');
        }
        if (
            //if not upload docs
            !req.files['paymentMethods.bankAccount[0][bankDocs]'] &&
            !req.files['paymentMethods.fawry[0][fawryDocs]'] &&
            !req.files['paymentMethods.vodafoneCash[0][vodafoneCashDocs]']
        ) {
            throw new BadRequestError('docs are required');
        }

        if (req.files['paymentMethods.bankAccount[0][bankDocs]'])
            await processDocs(
                'bankDocs',
                req.files['paymentMethods.bankAccount[0][bankDocs]'],
                req,res
            );

        if (req.files['paymentMethods.fawry[0][fawryDocs]'])
            await processDocs(
                'fawryDocs',
                req.files['paymentMethods.fawry[0][fawryDocs]'],
                req,res
            );

        if (req.files['paymentMethods.vodafoneCash[0][vodafoneCashDocs]'])
            await processDocs(
                'vodafoneCashDocs',
                req.files['paymentMethods.vodafoneCash[0][vodafoneCashDocs]'],
                req,res
            );

        next();
    } catch (error) {
        next(error);
    }
};

//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage:StorageEngine = multer.memoryStorage();
const upload:Multer = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadDocsReq = upload.fields([
    { name: 'paymentMethods.bankAccount[0][bankDocs]', maxCount: 2 },
    { name: 'paymentMethods.fawry[0][fawryDocs]', maxCount: 2 },
    { name: 'paymentMethods.vodafoneCash[0][vodafoneCashDocs]', maxCount: 2 },
]);

export { uploadDocsReq, resizeDocReq };
