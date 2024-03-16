import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { saveImg } from '../../index';
import { BadRequestError } from '../../../../errors/components/index';
import { NextFunction, Request, Response } from 'express';
//memoryStorage
const multerFilterOnlyImgs = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (file.mimetype.startsWith('image')) {
        //accepts imgs only
        cb(null, true);
    } else {
        cb(new BadRequestError('invalid type,Only images allowed'));
    }
};
const multerStorage = multer.memoryStorage();
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilterOnlyImgs,
});
const uploadDocs = upload.fields([
    { name: 'charityDocs[docs1]', maxCount: 2 },
    { name: 'charityDocs[docs2]', maxCount: 2 },
    { name: 'charityDocs[docs3]', maxCount: 2 },
    { name: 'charityDocs[docs4]', maxCount: 10 },
    { name: 'paymentMethods.bankAccount[0][bankDocs]', maxCount: 2 },
    { name: 'paymentMethods.fawry[0][fawryDocs]', maxCount: 2 },
    { name: 'paymentMethods.vodafoneCash[0][vodafoneCashDocs]', maxCount: 2 },
]);

async function processDocs(
    docsKey: string,
    ref: Express.Multer.File[],
    req: Request,
    res: Response
) {
    return Promise.all(
        ref.map(async (obj, indx: number) => {
            // const ex = obj.mimetype.split('/')[1];
            const uniquePrefix: string = uuidv4();
            const fileName: string = `${docsKey}-${res.locals.charity.name}--${res.locals.charity._id}--${indx}${uniquePrefix}.jpeg`;
            //   req.body.docsSent.push(fileName);

            const sharpPromise = sharp(obj.buffer)
                .resize(320, 240)
                .toFormat('jpeg')
                .jpeg({ quality: 90 });

            await saveImg(sharpPromise, 'charityDocs', fileName);

            if (docsKey === 'docs1') req.body.charityDocs.docs1.push(fileName);
            if (docsKey === 'docs2') req.body.charityDocs.docs2.push(fileName);
            if (docsKey === 'docs3') req.body.charityDocs.docs3.push(fileName);
            if (docsKey === 'docs4') req.body.charityDocs.docs4.push(fileName);
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.bankAccount &&
                docsKey === 'bankDocs'
            ) {
                req.body.paymentMethods.bankAccount.bankDocs.push(fileName);
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.fawry &&
                docsKey === 'fawryDocs'
            ) {
                req.body.paymentMethods.fawry.fawryDocs.push(fileName);
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.vodafoneCash &&
                docsKey === 'vodafoneCashDocs'
            ) {
                req.body.paymentMethods.vodafoneCash.vodafoneCashDocs.push(
                    fileName
                );
            }
        })
    );
}

const resizeDoc = async (
    req: Request & {
        files:
        {
            charityDocs: {
                docs1: Express.Multer.File[];
                docs2: Express.Multer.File[];
                docs3: Express.Multer.File[];
                docs4: Express.Multer.File[];
            };
        }

    },
    res: Response,
    next: NextFunction
) => {
    try {
        req.body.charityDocs = {};
        req.body.charityDocs.docs1 = [];
        req.body.charityDocs.docs2 = [];
        req.body.charityDocs.docs3 = [];
        req.body.charityDocs.docs4 = [];
        if (req.body.paymentMethods && req.body.paymentMethods.bankAccount) {
            req.body.paymentMethods.bankAccount.bankDocs = [];
        }
        if (req.body.paymentMethods && req.body.paymentMethods.fawry) {
            req.body.paymentMethods.fawry.fawryDocs = [];
        }
        if (req.body.paymentMethods && req.body.paymentMethods.vodafoneCash) {
            req.body.paymentMethods.vodafoneCash.vodafoneCashDocs = [];
        }
        if (!req.files) {
            throw new BadRequestError('docs are required');
        }
        if (!req.files || req.files.length === 0) {
            throw new BadRequestError('Docs are required');
        }

        // if (
        //     //if not upload docs 👇️ Needs some work. This means that you must upload the 4th doc if you wanna add any payment @saad please 😿😿😿
        //     !req.files['charityDocs[docs1]'] ||
        //     !req.files['charityDocs[docs2]'] ||
        //     !req.files['charityDocs[docs3]'] ||
        //     !req.files['charityDocs[docs4]'] ||
        //     (!req.files['charityDocs[docs4]'] &&
        //         (!req.files['paymentMethods.bankAccount[0][bankDocs]'] ||
        //             !req.files['paymentMethods.fawry[0][fawryDocs]'] ||
        //             !req.files[
        //             'paymentMethods.vodafoneCash[0][vodafoneCashDocs]'
        //             ]))
        // ) {
        //     throw new BadRequestError('docs are required');
        // }
        await processDocs('docs1', req.files.charityDocs.docs1, req, res);
        await processDocs('docs2', req.files.charityDocs.docs2, req, res);
        await processDocs('docs3', req.files.charityDocs.docs3, req, res);
        await processDocs('docs4', req.files.charityDocs.docs4, req, res);
        // if (req.files ['paymentMethods.bankAccount[0][bankDocs]'])
        //     await processDocs(
        //         'bankDocs',
        //         req.files ['paymentMethods.bankAccount[0][bankDocs]'],
        //         req, res
        //     );

        // if (req.files ['paymentMethods.fawry[0][fawryDocs]'])
        //     await processDocs(
        //         'fawryDocs',
        //         req.files ['paymentMethods.fawry[0][fawryDocs]'],
        //         req, res
        //     );

        // if (req.files ['paymentMethods.vodafoneCash[0][vodafoneCashDocs]'])
        //     await processDocs(
        //         'vodafoneCashDocs',
        //         req.files ['paymentMethods.vodafoneCash[0][vodafoneCashDocs]'],
        //         req, res
        //     );

        next();
    } catch (error) {
        next(error);
    }
};

export { uploadDocs, resizeDoc };
